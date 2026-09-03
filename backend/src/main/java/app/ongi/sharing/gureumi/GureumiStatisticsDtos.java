package app.ongi.sharing.gureumi;

import java.util.List;

final class GureumiStatisticsDtos {

    private GureumiStatisticsDtos() {}

    record StatisticsResponse(
        String version,
        List<VersionSummary> availableVersions,
        boolean completedAnswersOnly,
        boolean firstAttemptOnly,
        FunnelStatistics funnel,
        List<QuestionStatistics> questions,
        List<AxisStatistics> axes,
        List<ResultStatistics> results,
        FeedbackStatistics feedback
    ) {}

    record VersionSummary(String code, String status) {}

    record FunnelStatistics(
        long started,
        long q9Reached,
        double q9Rate,
        long q18Reached,
        double q18Rate,
        long completed,
        double completionRate,
        long feedbackSubmitted,
        double feedbackRate
    ) {}

    record QuestionStatistics(
        int order,
        String code,
        String prompt,
        String axis,
        long responseCount,
        long aVeryCount,
        double aVeryPercentage,
        long aLittleCount,
        double aLittlePercentage,
        long bLittleCount,
        double bLittlePercentage,
        long bVeryCount,
        double bVeryPercentage,
        Double averageScore,
        Long averageResponseMs
    ) {}

    record AxisStatistics(
        String key,
        String label,
        long completedCount,
        long highCount,
        double highPercentage,
        long lowCount,
        double lowPercentage,
        long boundaryCount,
        double boundaryPercentage,
        Double averageScore
    ) {}

    record ResultStatistics(
        String resultType,
        String displayName,
        long count,
        double percentage,
        long feedbackCount,
        Double averageRating,
        List<RatingStatistics> ratings
    ) {}

    record RatingStatistics(int rating, long count, double percentage) {}

    record FeedbackStatistics(
        long submittedCount,
        double completionResponsePercentage,
        Double averageRating,
        List<RatingStatistics> ratings
    ) {}
}
