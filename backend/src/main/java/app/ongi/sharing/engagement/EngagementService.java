package app.ongi.sharing.engagement;

import static app.ongi.sharing.engagement.EngagementDtos.CompleteParticipationRequest;
import static app.ongi.sharing.engagement.EngagementDtos.ContentResponse;
import static app.ongi.sharing.engagement.EngagementDtos.EnsureVisitRequest;
import static app.ongi.sharing.engagement.EngagementDtos.EventRequest;
import static app.ongi.sharing.engagement.EngagementDtos.EventResponse;
import static app.ongi.sharing.engagement.EngagementDtos.LikeResponse;
import static app.ongi.sharing.engagement.EngagementDtos.ParticipationResponse;
import static app.ongi.sharing.engagement.EngagementDtos.ResultSummary;
import static app.ongi.sharing.engagement.EngagementDtos.ShareLinkResponse;
import static app.ongi.sharing.engagement.EngagementDtos.StartParticipationRequest;
import static app.ongi.sharing.engagement.EngagementDtos.VisitResponse;
import static app.ongi.sharing.engagement.EngagementDtos.VisitorResponse;

import java.time.Clock;
import java.time.Instant;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import app.ongi.sharing.common.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EngagementService {

    private static final Set<String> SHARE_TARGETS = Set.of("native", "copy_link");

    private final VisitorRepository visitorRepository;
    private final VisitRepository visitRepository;
    private final ContentRepository contentRepository;
    private final ContentVersionRepository versionRepository;
    private final ContentResultRepository resultRepository;
    private final ParticipationRepository participationRepository;
    private final ContentLikeRepository likeRepository;
    private final EventLogRepository eventRepository;
    private final ShareLinkRepository shareLinkRepository;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    public EngagementService(
        VisitorRepository visitorRepository,
        VisitRepository visitRepository,
        ContentRepository contentRepository,
        ContentVersionRepository versionRepository,
        ContentResultRepository resultRepository,
        ParticipationRepository participationRepository,
        ContentLikeRepository likeRepository,
        EventLogRepository eventRepository,
        ShareLinkRepository shareLinkRepository,
        ObjectMapper objectMapper,
        Clock clock
    ) {
        this.visitorRepository = visitorRepository;
        this.visitRepository = visitRepository;
        this.contentRepository = contentRepository;
        this.versionRepository = versionRepository;
        this.resultRepository = resultRepository;
        this.participationRepository = participationRepository;
        this.likeRepository = likeRepository;
        this.eventRepository = eventRepository;
        this.shareLinkRepository = shareLinkRepository;
        this.objectMapper = objectMapper;
        this.clock = clock;
    }

    @Transactional
    public VisitorResponse ensureVisitor(UUID visitorKey) {
        Instant now = clock.instant();
        visitorRepository.upsert(visitorKey, now);
        return visitorResponse(requireVisitor(visitorKey));
    }

    @Transactional
    public VisitResponse ensureVisit(UUID visitKey, EnsureVisitRequest request) {
        Instant now = clock.instant();
        visitorRepository.upsert(request.visitorKey(), now);
        Visitor visitor = requireVisitor(request.visitorKey());
        ShareLink shareLink = request.shareCode() == null ? null : requireAvailableShareLink(request.shareCode(), now);
        visitRepository.upsert(visitor.getId(), visitKey, shareLink == null ? null : shareLink.getId(), now);
        Visit visit = requireVisit(visitKey);

        if (!visit.getVisitor().getId().equals(visitor.getId())) {
            throw conflict("VISIT_KEY_CONFLICT", "이미 다른 익명 방문자에게 사용된 방문 키입니다.");
        }
        if (shareLink != null && (visit.getShareLink() == null || !visit.getShareLink().getId().equals(shareLink.getId()))) {
            throw conflict("VISIT_SHARE_LINK_CONFLICT", "이미 다른 공유 링크에 연결된 방문입니다.");
        }

        return visitResponse(visit);
    }

    @Transactional(readOnly = true)
    public ContentResponse content(String contentCode) {
        ContentVersion version = requireCurrentVersion(contentCode);
        return new ContentResponse(
            version.getContent().getCode(),
            version.getContent().getName(),
            version.getContent().getType(),
            version.getVersionNo(),
            resultRepository.findAllByVersionIdAndActiveTrueOrderBySortOrder(version.getId()).stream()
                .map(result -> new ResultSummary(result.getCode(), result.getName(), result.getSortOrder()))
                .toList()
        );
    }

    @Transactional
    public ParticipationResponse startParticipation(StartParticipationRequest request) {
        Visit visit = requireVisit(request.visitKey());
        ContentVersion version = requireCurrentVersion(request.contentCode().strip());
        participationRepository.insertIfAbsent(visit.getId(), version.getId(), request.requestKey(), clock.instant());
        Participation participation = participationRepository.findByRequestKeyWithRelations(request.requestKey())
            .orElseThrow(() -> new IllegalStateException("Participation insert did not return a row"));

        if (!participation.getVisit().getId().equals(visit.getId())
            || !participation.getVersion().getId().equals(version.getId())) {
            throw conflict("PARTICIPATION_KEY_CONFLICT", "이미 다른 참여에 사용된 요청 키입니다.");
        }

        return participationResponse(participation);
    }

    @Transactional
    public ParticipationResponse completeParticipation(Long participationId, CompleteParticipationRequest request) {
        Visit visit = requireVisit(request.visitKey());
        Participation participation = participationRepository.findByIdForUpdate(participationId)
            .orElseThrow(() -> notFound("PARTICIPATION_NOT_FOUND", "참여 기록을 찾을 수 없습니다."));

        if (!participation.getVisit().getId().equals(visit.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "PARTICIPATION_VISIT_MISMATCH", "이 방문에서 시작한 참여가 아닙니다.");
        }

        ContentResult result = resolveResult(participation.getVersion(), request.resultCode());
        if (participation.getCompletedAt() != null) {
            Long savedResultId = participation.getResult() == null ? null : participation.getResult().getId();
            Long requestedResultId = result == null ? null : result.getId();
            if (!Objects.equals(savedResultId, requestedResultId)) {
                throw conflict("PARTICIPATION_ALREADY_COMPLETED", "이미 다른 결과로 완료된 참여입니다.");
            }
            return participationResponse(participation);
        }

        participation.complete(result, clock.instant());
        participationRepository.flush();
        return participationResponse(participation);
    }

    @Transactional(readOnly = true)
    public LikeResponse likeStatus(String contentCode, UUID visitorKey) {
        Content content = requirePublishedContent(contentCode);
        boolean liked = visitorRepository.findByVisitorKey(visitorKey)
            .map(visitor -> likeRepository.existsByVisitorIdAndContentId(visitor.getId(), content.getId()))
            .orElse(false);
        return new LikeResponse(liked, likeRepository.countByContentId(content.getId()));
    }

    @Transactional
    public LikeResponse like(String contentCode, UUID visitorKey) {
        Instant now = clock.instant();
        visitorRepository.upsert(visitorKey, now);
        Visitor visitor = requireVisitor(visitorKey);
        Content content = requirePublishedContent(contentCode);
        likeRepository.insertIfAbsent(visitor.getId(), content.getId(), now);
        return new LikeResponse(true, likeRepository.countByContentId(content.getId()));
    }

    @Transactional
    public LikeResponse unlike(String contentCode, UUID visitorKey) {
        Content content = requirePublishedContent(contentCode);
        visitorRepository.findByVisitorKey(visitorKey)
            .ifPresent(visitor -> likeRepository.deleteByVisitorIdAndContentId(visitor.getId(), content.getId()));
        return new LikeResponse(false, likeRepository.countByContentId(content.getId()));
    }

    @Transactional
    public EventResponse recordEvent(EventRequest request) {
        Visit visit = requireVisit(request.visitKey());
        Map<String, String> data = validateEventData(request);
        Content content = resolveEventContent(request);
        int inserted = eventRepository.insertIfAbsent(
            request.eventKey(), visit.getId(), content == null ? null : content.getId(),
            request.eventType().name(), toJson(data), clock.instant()
        );

        if (inserted == 0) {
            EventLog existing = eventRepository.findByEventKeyWithRelations(request.eventKey())
                .orElseThrow(() -> new IllegalStateException("Event conflict did not return a row"));
            Long existingContentId = existing.getContent() == null ? null : existing.getContent().getId();
            Long requestedContentId = content == null ? null : content.getId();
            if (!existing.getVisit().getId().equals(visit.getId())
                || !Objects.equals(existingContentId, requestedContentId)
                || existing.getEventType() != request.eventType()
                || !existing.getData().equals(data)) {
                throw conflict("EVENT_KEY_CONFLICT", "이미 다른 이벤트에 사용된 이벤트 키입니다.");
            }
        }

        return new EventResponse(inserted == 1);
    }

    @Transactional(readOnly = true)
    public ShareLinkResponse shareLink(String code) {
        ShareLink link = requireAvailableShareLink(code, clock.instant());
        return new ShareLinkResponse(link.getCode(), link.getName(), link.getContent().getCode(), link.getExpiresAt());
    }

    private Content resolveEventContent(EventRequest request) {
        if (request.eventType() == EngagementEventType.PAGE_VIEW) {
            if (request.contentCode() != null && !request.contentCode().isBlank()) {
                throw invalid("EVENT_CONTENT_NOT_ALLOWED", "PAGE_VIEW에는 콘텐츠를 지정하지 않습니다.");
            }
            return null;
        }
        if (request.contentCode() == null || request.contentCode().isBlank()) {
            throw invalid("EVENT_CONTENT_REQUIRED", "이 이벤트에는 콘텐츠가 필요합니다.");
        }
        return requirePublishedContent(request.contentCode().strip());
    }

    private Map<String, String> validateEventData(EventRequest request) {
        Map<String, String> data = request.data() == null ? Map.of() : Map.copyOf(request.data());
        if (request.eventType() != EngagementEventType.SHARE_CLICK) {
            if (!data.isEmpty()) {
                throw invalid("EVENT_DATA_NOT_ALLOWED", "이 이벤트에는 추가 데이터를 저장하지 않습니다.");
            }
            return data;
        }
        if (!data.keySet().equals(Set.of("target")) || !SHARE_TARGETS.contains(data.get("target"))) {
            throw invalid("INVALID_SHARE_TARGET", "허용되지 않은 공유 방식입니다.");
        }
        return data;
    }

    private ContentResult resolveResult(ContentVersion version, String requestedCode) {
        long resultCount = resultRepository.countByVersionIdAndActiveTrue(version.getId());
        String resultCode = requestedCode == null ? null : requestedCode.strip();

        if (resultCount == 0) {
            if (resultCode != null && !resultCode.isEmpty()) {
                throw invalid("RESULT_NOT_SUPPORTED", "이 콘텐츠 버전은 결과를 저장하지 않습니다.");
            }
            return null;
        }
        if (resultCode == null || resultCode.isEmpty()) {
            throw invalid("RESULT_REQUIRED", "완료 결과가 필요합니다.");
        }
        return resultRepository.findByVersionIdAndCodeAndActiveTrue(version.getId(), resultCode)
            .orElseThrow(() -> invalid("INVALID_RESULT", "현재 콘텐츠 버전에 없는 결과입니다."));
    }

    private ContentVersion requireCurrentVersion(String contentCode) {
        return versionRepository.findCurrentPublished(contentCode, clock.instant())
            .orElseThrow(() -> notFound("CONTENT_NOT_AVAILABLE", "현재 공개된 콘텐츠가 아닙니다."));
    }

    private Content requirePublishedContent(String contentCode) {
        return contentRepository.findByCodeAndStatus(contentCode, ContentStatus.PUBLISHED)
            .orElseThrow(() -> notFound("CONTENT_NOT_AVAILABLE", "현재 공개된 콘텐츠가 아닙니다."));
    }

    private Visitor requireVisitor(UUID visitorKey) {
        return visitorRepository.findByVisitorKey(visitorKey)
            .orElseThrow(() -> notFound("VISITOR_NOT_FOUND", "익명 방문자를 찾을 수 없습니다."));
    }

    private Visit requireVisit(UUID visitKey) {
        return visitRepository.findByVisitKeyWithRelations(visitKey)
            .orElseThrow(() -> notFound("VISIT_NOT_FOUND", "방문 세션을 찾을 수 없습니다."));
    }

    private ShareLink requireAvailableShareLink(String code, Instant now) {
        ShareLink link = shareLinkRepository.findByCodeWithContent(code)
            .orElseThrow(() -> notFound("SHARE_LINK_NOT_FOUND", "공유 링크를 찾을 수 없습니다."));
        if (!link.isAvailable(now) || link.getContent().getStatus() != ContentStatus.PUBLISHED) {
            throw notFound("SHARE_LINK_NOT_AVAILABLE", "만료되었거나 사용할 수 없는 공유 링크입니다.");
        }
        return link;
    }

    private VisitorResponse visitorResponse(Visitor visitor) {
        return new VisitorResponse(visitor.getVisitorKey(), visitor.getCreatedAt(), visitor.getLastSeenAt());
    }

    private VisitResponse visitResponse(Visit visit) {
        return new VisitResponse(
            visit.getVisitKey(), visit.getVisitor().getVisitorKey(),
            visit.getShareLink() == null ? null : visit.getShareLink().getCode(),
            visit.getStartedAt(), visit.getLastSeenAt()
        );
    }

    private ParticipationResponse participationResponse(Participation participation) {
        return new ParticipationResponse(
            participation.getId(), participation.getRequestKey(),
            participation.getVersion().getContent().getCode(), participation.getVersion().getVersionNo(),
            participation.getResult() == null ? null : participation.getResult().getCode(),
            participation.getStartedAt(), participation.getCompletedAt()
        );
    }

    private String toJson(Map<String, String> data) {
        try {
            return objectMapper.writeValueAsString(data);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Validated event data could not be serialized", exception);
        }
    }

    private ApiException invalid(String code, String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, code, message);
    }

    private ApiException notFound(String code, String message) {
        return new ApiException(HttpStatus.NOT_FOUND, code, message);
    }

    private ApiException conflict(String code, String message) {
        return new ApiException(HttpStatus.CONFLICT, code, message);
    }
}
