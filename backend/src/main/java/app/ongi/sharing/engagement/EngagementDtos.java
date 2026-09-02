package app.ongi.sharing.engagement;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class EngagementDtos {
    private EngagementDtos() {}

    public record VisitorResponse(
        UUID visitorKey,
        Instant createdAt,
        Instant lastSeenAt
    ) {}

    public record EnsureVisitRequest(
        @NotNull UUID visitorKey,
        @Pattern(regexp = "[A-Za-z0-9_-]{6,32}") String shareCode
    ) {}

    public record VisitResponse(
        UUID visitKey,
        UUID visitorKey,
        String shareCode,
        Instant startedAt,
        Instant lastSeenAt
    ) {}

    public record ResultSummary(String code, String name, int sortOrder) {}

    public record ContentResponse(
        String code,
        String name,
        ContentType type,
        String versionNo,
        List<ResultSummary> results
    ) {}

    public record StartParticipationRequest(
        @NotNull UUID visitKey,
        @NotBlank @Size(max = 80) String contentCode,
        @NotNull UUID requestKey
    ) {}

    public record CompleteParticipationRequest(
        @NotNull UUID visitKey,
        @Size(max = 80) String resultCode
    ) {}

    public record ParticipationResponse(
        Long participationId,
        UUID requestKey,
        String contentCode,
        String versionNo,
        String resultCode,
        Instant startedAt,
        Instant completedAt
    ) {}

    public record LikeRequest(
        @NotNull UUID visitorKey,
        @Size(max = 80) String variantCode
    ) {}

    public record LikeResponse(String variantCode, boolean liked, long likeCount) {}

    public record EventRequest(
        @NotNull UUID eventKey,
        @NotNull UUID visitKey,
        @Size(max = 80) String contentCode,
        @NotNull EngagementEventType eventType,
        @Size(max = 2) Map<String, String> data
    ) {}

    public record EventResponse(boolean recorded) {}

    public record VisitorStatisticsResponse(long visitorCount) {}

    public record ShareLinkResponse(
        String code,
        String name,
        String contentCode,
        Instant expiresAt
    ) {}

    public record ResultStatistics(
        String resultCode,
        String resultName,
        long completionCount,
        double percentage
    ) {}

    public record VariantLikeStatistics(String variantCode, long likeCount) {}

    public record VersionStatistics(
        String versionNo,
        long participationCount,
        long completionCount,
        List<ResultStatistics> results
    ) {}

    public record ContentStatisticsResponse(
        String contentCode,
        long contentViewCount,
        long uniqueViewerCount,
        long participationCount,
        long participantCount,
        long completionCount,
        double completionRate,
        long likeCount,
        long shareCount,
        List<VariantLikeStatistics> variantLikes,
        List<VersionStatistics> versions
    ) {}
}
