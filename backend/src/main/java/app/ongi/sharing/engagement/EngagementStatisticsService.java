package app.ongi.sharing.engagement;

import static app.ongi.sharing.engagement.EngagementDtos.ContentStatisticsResponse;
import static app.ongi.sharing.engagement.EngagementDtos.ResultStatistics;
import static app.ongi.sharing.engagement.EngagementDtos.VersionStatistics;
import static app.ongi.sharing.engagement.EngagementDtos.VisitorStatisticsResponse;
import static app.ongi.sharing.engagement.EngagementDtos.VariantLikeStatistics;

import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import app.ongi.sharing.common.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EngagementStatisticsService {

    private final ContentRepository contentRepository;
    private final ContentVersionRepository versionRepository;
    private final ContentLikeRepository likeRepository;
    private final ShareLinkRepository shareLinkRepository;
    private final JdbcTemplate jdbcTemplate;
    private final Clock clock;

    public EngagementStatisticsService(
        ContentRepository contentRepository,
        ContentVersionRepository versionRepository,
        ContentLikeRepository likeRepository,
        ShareLinkRepository shareLinkRepository,
        JdbcTemplate jdbcTemplate,
        Clock clock
    ) {
        this.contentRepository = contentRepository;
        this.versionRepository = versionRepository;
        this.likeRepository = likeRepository;
        this.shareLinkRepository = shareLinkRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public ContentStatisticsResponse contentStatistics(String contentCode) {
        Content content = contentRepository.findByCodeAndStatus(contentCode, ContentStatus.PUBLISHED)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CONTENT_NOT_AVAILABLE", "현재 공개된 콘텐츠가 아닙니다."));
        Long contentId = content.getId();
        long views = count("SELECT count(*) FROM event_log WHERE content_id = ? AND event_type = 'CONTENT_VIEW'", contentId);
        long uniqueViewers = count("""
            SELECT count(DISTINCT visit.visitor_id)
            FROM event_log event
            JOIN visit ON visit.id = event.visit_id
            WHERE event.content_id = ? AND event.event_type = 'CONTENT_VIEW'
            """, contentId);
        long participations = count("""
            SELECT count(*) FROM participation participation
            JOIN content_version version ON version.id = participation.version_id
            WHERE version.content_id = ?
            """, contentId);
        long participants = count("""
            SELECT count(DISTINCT visit.visitor_id)
            FROM participation participation
            JOIN visit ON visit.id = participation.visit_id
            JOIN content_version version ON version.id = participation.version_id
            WHERE version.content_id = ?
            """, contentId);
        long completions = count("""
            SELECT count(*) FROM participation participation
            JOIN content_version version ON version.id = participation.version_id
            WHERE version.content_id = ? AND participation.completed_at IS NOT NULL
            """, contentId);
        long shares = count("SELECT count(*) FROM event_log WHERE content_id = ? AND event_type = 'SHARE_CLICK'", contentId);
        List<VariantLikeStatistics> variantLikes = LikeVariantPolicy.variants(content.getCode()).stream()
            .map(variantCode -> new VariantLikeStatistics(
                variantCode,
                likeRepository.countByContentIdAndVariantCode(contentId, variantCode)
            ))
            .toList();
        List<VersionStatistics> versions = versionRepository.findAllByContentIdOrderByPublishedAtAsc(contentId).stream()
            .filter(version -> version.getPublishedAt() != null)
            .map(this::versionStatistics)
            .toList();

        return new ContentStatisticsResponse(
            content.getCode(), views, uniqueViewers, participations, participants, completions,
            ratio(completions, participations), likeRepository.countByContentId(contentId), shares,
            variantLikes, versions
        );
    }

    @Transactional(readOnly = true)
    public VisitorStatisticsResponse visitorStatistics() {
        return new VisitorStatisticsResponse(count("SELECT count(*) FROM visitor"));
    }

    @Transactional(readOnly = true)
    public ServiceStatistics serviceStatistics() {
        Instant today = clock.instant().truncatedTo(ChronoUnit.DAYS);
        return new ServiceStatistics(
            count("SELECT count(*) FROM visitor"),
            count("SELECT count(*) FROM visitor WHERE created_at >= ?", today),
            count("SELECT count(*) FROM visit"),
            count("SELECT count(*) FROM event_log WHERE event_type = 'PAGE_VIEW'")
        );
    }

    @Transactional(readOnly = true)
    public ShareLinkStatistics shareLinkStatistics(String shareCode) {
        ShareLink link = shareLinkRepository.findByCodeWithContent(shareCode)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SHARE_LINK_NOT_FOUND", "공유 링크를 찾을 수 없습니다."));
        Long linkId = link.getId();
        long visits = count("SELECT count(*) FROM visit WHERE share_link_id = ?", linkId);
        long participations = count("""
            SELECT count(*) FROM participation participation
            JOIN visit ON visit.id = participation.visit_id
            WHERE visit.share_link_id = ?
            """, linkId);
        long completions = count("""
            SELECT count(*) FROM participation participation
            JOIN visit ON visit.id = participation.visit_id
            WHERE visit.share_link_id = ? AND participation.completed_at IS NOT NULL
            """, linkId);
        List<ResultCount> results = jdbcTemplate.query("""
            SELECT result.code, result.name, count(participation.id) AS completion_count
            FROM content_result result
            JOIN participation ON participation.result_id = result.id
            JOIN visit ON visit.id = participation.visit_id
            WHERE visit.share_link_id = ? AND participation.completed_at IS NOT NULL
            GROUP BY result.id, result.code, result.name, result.sort_order
            ORDER BY result.sort_order
            """, (resultSet, rowNumber) -> new ResultCount(
                resultSet.getString("code"), resultSet.getString("name"), resultSet.getLong("completion_count")
            ), linkId);
        return new ShareLinkStatistics(shareCode, visits, participations, completions, results);
    }

    private VersionStatistics versionStatistics(ContentVersion version) {
        long participationCount = count("SELECT count(*) FROM participation WHERE version_id = ?", version.getId());
        long completionCount = count(
            "SELECT count(*) FROM participation WHERE version_id = ? AND completed_at IS NOT NULL",
            version.getId()
        );
        List<ResultStatistics> results = jdbcTemplate.query("""
            SELECT result.code, result.name, count(participation.id) AS completion_count
            FROM content_result result
            LEFT JOIN participation
              ON participation.result_id = result.id
             AND participation.completed_at IS NOT NULL
            WHERE result.version_id = ? AND result.active = TRUE
            GROUP BY result.id, result.code, result.name, result.sort_order
            ORDER BY result.sort_order
            """, (resultSet, rowNumber) -> {
                long resultCompletions = resultSet.getLong("completion_count");
                return new ResultStatistics(
                    resultSet.getString("code"), resultSet.getString("name"), resultCompletions,
                    ratio(resultCompletions, completionCount)
                );
            }, version.getId());
        return new VersionStatistics(version.getVersionNo(), participationCount, completionCount, results);
    }

    private long count(String sql, Object... arguments) {
        Long value = jdbcTemplate.queryForObject(sql, Long.class, arguments);
        return value == null ? 0 : value;
    }

    private double ratio(long numerator, long denominator) {
        return denominator == 0 ? 0 : Math.round((numerator * 10000.0) / denominator) / 100.0;
    }

    public record ServiceStatistics(long visitorCount, long todayVisitorCount, long visitCount, long pageViewCount) {}

    public record ResultCount(String resultCode, String resultName, long completionCount) {}

    public record ShareLinkStatistics(
        String shareCode,
        long visitCount,
        long participationCount,
        long completionCount,
        List<ResultCount> results
    ) {}
}
