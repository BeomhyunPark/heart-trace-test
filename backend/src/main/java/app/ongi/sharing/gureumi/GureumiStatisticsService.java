package app.ongi.sharing.gureumi;

import static app.ongi.sharing.gureumi.GureumiStatisticsDtos.AxisStatistics;
import static app.ongi.sharing.gureumi.GureumiStatisticsDtos.FeedbackStatistics;
import static app.ongi.sharing.gureumi.GureumiStatisticsDtos.FunnelStatistics;
import static app.ongi.sharing.gureumi.GureumiStatisticsDtos.QuestionStatistics;
import static app.ongi.sharing.gureumi.GureumiStatisticsDtos.RatingStatistics;
import static app.ongi.sharing.gureumi.GureumiStatisticsDtos.ResultStatistics;
import static app.ongi.sharing.gureumi.GureumiStatisticsDtos.StatisticsResponse;
import static app.ongi.sharing.gureumi.GureumiStatisticsDtos.VersionSummary;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import app.ongi.sharing.common.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class GureumiStatisticsService {

    private final GureumiTestVersionRepository versionRepository;
    private final JdbcTemplate jdbcTemplate;

    GureumiStatisticsService(
        GureumiTestVersionRepository versionRepository,
        JdbcTemplate jdbcTemplate
    ) {
        this.versionRepository = versionRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    StatisticsResponse statistics(
        String requestedVersion,
        boolean completedAnswersOnly,
        boolean firstAttemptOnly
    ) {
        GureumiTestVersion version = resolveVersion(requestedVersion);
        List<VersionSummary> versions = versionRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(item -> new VersionSummary(item.getCode(), item.getStatus().name()))
            .toList();
        FunnelStatistics funnel = funnel(version, firstAttemptOnly);
        List<QuestionStatistics> questions = questions(
            version, completedAnswersOnly, firstAttemptOnly
        );
        List<AxisStatistics> axes = Arrays.stream(TraitAxis.values())
            .map(axis -> axis(version, axis, firstAttemptOnly))
            .toList();
        List<ResultStatistics> results = results(version, firstAttemptOnly);
        FeedbackStatistics feedback = feedback(results, funnel.completed());
        return new StatisticsResponse(
            version.getCode(), versions, completedAnswersOnly, firstAttemptOnly,
            funnel, questions, axes, results, feedback
        );
    }

    private GureumiTestVersion resolveVersion(String requestedVersion) {
        if (requestedVersion == null || requestedVersion.isBlank()) {
            return versionRepository.findFirstByStatusOrderByCreatedAtDesc(GureumiVersionStatus.ACTIVE)
                .orElseThrow(this::versionUnavailable);
        }
        return versionRepository.findByCode(requestedVersion)
            .orElseThrow(() -> new ApiException(
                HttpStatus.NOT_FOUND,
                "GUREUMI_VERSION_NOT_FOUND",
                "요청한 구르미 테스트 버전을 찾을 수 없습니다."
            ));
    }

    private FunnelStatistics funnel(GureumiTestVersion version, boolean firstAttemptOnly) {
        String firstAttemptClause = firstAttemptOnly ? " AND attempt.is_first_attempt = TRUE" : "";
        return jdbcTemplate.queryForObject("""
            SELECT
              count(*) AS started,
              count(*) FILTER (WHERE EXISTS (
                SELECT 1 FROM gureumi_answer answer
                JOIN gureumi_question question ON question.id = answer.question_id
                WHERE answer.attempt_id = attempt.id AND question.order_no >= 9
              )) AS q9_reached,
              count(*) FILTER (WHERE EXISTS (
                SELECT 1 FROM gureumi_answer answer
                JOIN gureumi_question question ON question.id = answer.question_id
                WHERE answer.attempt_id = attempt.id AND question.order_no >= 18
              )) AS q18_reached,
              count(*) FILTER (WHERE attempt.status = 'COMPLETED') AS completed,
              count(*) FILTER (WHERE EXISTS (
                SELECT 1 FROM gureumi_result_feedback feedback
                WHERE feedback.attempt_id = attempt.id
              )) AS feedback_submitted
            FROM gureumi_attempt attempt
            WHERE attempt.version_id = ?
            """ + firstAttemptClause, (resultSet, rowNumber) -> {
                long started = resultSet.getLong("started");
                long q9 = resultSet.getLong("q9_reached");
                long q18 = resultSet.getLong("q18_reached");
                long completed = resultSet.getLong("completed");
                long feedback = resultSet.getLong("feedback_submitted");
                return new FunnelStatistics(
                    started,
                    q9, percentage(q9, started),
                    q18, percentage(q18, started),
                    completed, percentage(completed, started),
                    feedback, percentage(feedback, completed)
                );
            }, version.getId());
    }

    private List<QuestionStatistics> questions(
        GureumiTestVersion version,
        boolean completedAnswersOnly,
        boolean firstAttemptOnly
    ) {
        String completedClause = completedAnswersOnly ? " AND attempt.status = 'COMPLETED'" : "";
        String firstAttemptClause = firstAttemptOnly ? " AND attempt.is_first_attempt = TRUE" : "";
        return jdbcTemplate.query("""
            WITH eligible_answers AS (
              SELECT answer.question_id, answer.choice, answer.score, answer.response_ms
              FROM gureumi_answer answer
              JOIN gureumi_attempt attempt ON attempt.id = answer.attempt_id
              WHERE attempt.version_id = ?
            """ + completedClause + firstAttemptClause + """
            )
            SELECT
              question.order_no,
              question.code,
              question.prompt,
              question.axis,
              count(answer.question_id) AS response_count,
              count(*) FILTER (WHERE answer.choice = 'A_VERY') AS a_very_count,
              count(*) FILTER (WHERE answer.choice = 'A_LITTLE') AS a_little_count,
              count(*) FILTER (WHERE answer.choice = 'B_LITTLE') AS b_little_count,
              count(*) FILTER (WHERE answer.choice = 'B_VERY') AS b_very_count,
              avg(answer.score) AS average_score,
              avg(answer.response_ms) AS average_response_ms
            FROM gureumi_question question
            LEFT JOIN eligible_answers answer ON answer.question_id = question.id
            WHERE question.version_id = ? AND question.active = TRUE
            GROUP BY question.id, question.order_no, question.code, question.prompt, question.axis
            ORDER BY question.order_no
            """, (resultSet, rowNumber) -> {
                long responseCount = resultSet.getLong("response_count");
                long aVery = resultSet.getLong("a_very_count");
                long aLittle = resultSet.getLong("a_little_count");
                long bLittle = resultSet.getLong("b_little_count");
                long bVery = resultSet.getLong("b_very_count");
                Double averageScore = nullableDouble(resultSet, "average_score");
                Double responseMs = nullableDouble(resultSet, "average_response_ms");
                return new QuestionStatistics(
                    resultSet.getInt("order_no"),
                    resultSet.getString("code"),
                    resultSet.getString("prompt"),
                    resultSet.getString("axis"),
                    responseCount,
                    aVery, percentage(aVery, responseCount),
                    aLittle, percentage(aLittle, responseCount),
                    bLittle, percentage(bLittle, responseCount),
                    bVery, percentage(bVery, responseCount),
                    averageScore == null ? null : round(averageScore, 2),
                    responseMs == null ? null : Math.round(responseMs)
                );
            }, version.getId(), version.getId());
    }

    private AxisStatistics axis(
        GureumiTestVersion version,
        TraitAxis axis,
        boolean firstAttemptOnly
    ) {
        String prefix = axis.name().toLowerCase(Locale.ROOT);
        String firstAttemptClause = firstAttemptOnly ? " AND is_first_attempt = TRUE" : "";
        return jdbcTemplate.queryForObject("""
            SELECT
              count(*) AS completed_count,
              count(*) FILTER (WHERE %1$s_level = 'HIGH') AS high_count,
              count(*) FILTER (WHERE %1$s_level = 'LOW') AS low_count,
              count(*) FILTER (WHERE %1$s_boundary = TRUE) AS boundary_count,
              avg(%1$s_score) AS average_score
            FROM gureumi_attempt
            WHERE version_id = ? AND status = 'COMPLETED'
            """.formatted(prefix) + firstAttemptClause, (resultSet, rowNumber) -> {
                long completed = resultSet.getLong("completed_count");
                long high = resultSet.getLong("high_count");
                long low = resultSet.getLong("low_count");
                long boundary = resultSet.getLong("boundary_count");
                Double averageScore = nullableDouble(resultSet, "average_score");
                return new AxisStatistics(
                    axis.name(), axisLabel(axis), completed,
                    high, percentage(high, completed),
                    low, percentage(low, completed),
                    boundary, percentage(boundary, completed),
                    averageScore == null ? null : round(averageScore, 2)
                );
            }, version.getId());
    }

    private List<ResultStatistics> results(GureumiTestVersion version, boolean firstAttemptOnly) {
        String firstAttemptClause = firstAttemptOnly ? " AND attempt.is_first_attempt = TRUE" : "";
        Map<GureumiResultType, ResultAggregate> aggregates = new EnumMap<>(GureumiResultType.class);
        jdbcTemplate.query("""
            SELECT
              attempt.result_type,
              count(*) AS result_count,
              count(feedback.id) AS feedback_count,
              avg(feedback.rating) AS average_rating,
              count(feedback.id) FILTER (WHERE feedback.rating = 1) AS rating_1,
              count(feedback.id) FILTER (WHERE feedback.rating = 2) AS rating_2,
              count(feedback.id) FILTER (WHERE feedback.rating = 3) AS rating_3,
              count(feedback.id) FILTER (WHERE feedback.rating = 4) AS rating_4
            FROM gureumi_attempt attempt
            LEFT JOIN gureumi_result_feedback feedback ON feedback.attempt_id = attempt.id
            WHERE attempt.version_id = ? AND attempt.status = 'COMPLETED'
            """ + firstAttemptClause + """

            GROUP BY attempt.result_type
            """, resultSet -> {
                GureumiResultType resultType = GureumiResultType.valueOf(resultSet.getString("result_type"));
                aggregates.put(resultType, new ResultAggregate(
                    resultSet.getLong("result_count"),
                    resultSet.getLong("feedback_count"),
                    nullableDouble(resultSet, "average_rating"),
                    new long[] {
                        resultSet.getLong("rating_1"),
                        resultSet.getLong("rating_2"),
                        resultSet.getLong("rating_3"),
                        resultSet.getLong("rating_4")
                    }
                ));
            }, version.getId());
        long completedCount = aggregates.values().stream().mapToLong(ResultAggregate::count).sum();
        return Arrays.stream(GureumiResultType.values()).map(resultType -> {
            ResultAggregate aggregate = aggregates.getOrDefault(resultType, ResultAggregate.empty());
            return new ResultStatistics(
                resultType.name(),
                resultType.displayName(),
                aggregate.count(),
                percentage(aggregate.count(), completedCount),
                aggregate.feedbackCount(),
                aggregate.averageRating() == null ? null : round(aggregate.averageRating(), 2),
                ratings(aggregate.ratings(), aggregate.feedbackCount())
            );
        }).toList();
    }

    private FeedbackStatistics feedback(List<ResultStatistics> results, long completedCount) {
        long[] ratingCounts = new long[4];
        long submitted = 0;
        for (ResultStatistics result : results) {
            submitted += result.feedbackCount();
            for (RatingStatistics rating : result.ratings()) {
                ratingCounts[rating.rating() - 1] += rating.count();
            }
        }
        double weightedTotal = 0;
        for (int index = 0; index < ratingCounts.length; index++) {
            weightedTotal += (index + 1) * ratingCounts[index];
        }
        Double average = submitted == 0 ? null : round(weightedTotal / submitted, 2);
        return new FeedbackStatistics(
            submitted,
            percentage(submitted, completedCount),
            average,
            ratings(ratingCounts, submitted)
        );
    }

    private List<RatingStatistics> ratings(long[] counts, long total) {
        return java.util.stream.IntStream.rangeClosed(1, 4)
            .mapToObj(rating -> new RatingStatistics(
                rating, counts[rating - 1], percentage(counts[rating - 1], total)
            ))
            .toList();
    }

    private String axisLabel(TraitAxis axis) {
        return switch (axis) {
            case NOVELTY -> "새로움";
            case WORRY -> "걱정";
            case RELATION -> "관계";
        };
    }

    private Double nullableDouble(ResultSet resultSet, String column) throws SQLException {
        Number value = (Number) resultSet.getObject(column);
        return value == null ? null : value.doubleValue();
    }

    private double percentage(long numerator, long denominator) {
        return denominator == 0 ? 0 : round((numerator * 100.0) / denominator, 1);
    }

    private double round(double value, int places) {
        double factor = Math.pow(10, places);
        return Math.round(value * factor) / factor;
    }

    private ApiException versionUnavailable() {
        return new ApiException(
            HttpStatus.SERVICE_UNAVAILABLE,
            "GUREUMI_VERSION_UNAVAILABLE",
            "조회할 구르미 테스트 버전이 없습니다."
        );
    }

    private record ResultAggregate(
        long count,
        long feedbackCount,
        Double averageRating,
        long[] ratings
    ) {
        static ResultAggregate empty() {
            return new ResultAggregate(0, 0, null, new long[4]);
        }
    }
}
