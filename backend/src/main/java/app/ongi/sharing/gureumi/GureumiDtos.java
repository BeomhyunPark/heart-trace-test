package app.ongi.sharing.gureumi;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

final class GureumiDtos {

    private GureumiDtos() {}

    record CreatedAttemptResponse(
        UUID attemptId,
        String resumeToken,
        String version,
        int attemptNo,
        Instant startedAt
    ) {}

    record AttemptStateResponse(
        UUID attemptId,
        String version,
        int attemptNo,
        boolean completed,
        int answeredCount,
        int nextOrder,
        List<SavedAnswerResponse> answers,
        Instant startedAt,
        Instant completedAt
    ) {}

    record SavedAnswerResponse(UUID questionId, GureumiChoice choice) {}

    record QuestionResponse(
        UUID questionId,
        int order,
        String prompt,
        String optionA,
        String optionB
    ) {}

    record QuestionsResponse(String version, List<QuestionResponse> questions) {}

    record SaveAnswerRequest(
        @NotNull UUID questionId,
        @NotNull GureumiChoice choice,
        @Min(0) @Max(3_600_000) Integer responseMs
    ) {}

    record CompletionResponse(UUID attemptId, boolean completed, String resultType, String characterKey) {}

    record ResultResponse(
        UUID attemptId,
        String version,
        String resultType,
        String characterKey,
        String displayName,
        List<TraitAxisResponse> axes,
        Integer feedbackRating
    ) {}

    record TraitAxisResponse(String key, String label, TraitLevel level) {}

    record FeedbackRequest(
        @Min(1) @Max(4) Integer rating,
        @Size(max = 27) List<@Min(1) @Max(27) Integer> confusingQuestionOrders,
        GureumiResultType selfSelectedResultType
    ) {}

    record FeedbackResponse(
        UUID attemptId,
        Integer rating,
        List<Integer> confusingQuestionOrders,
        String selfSelectedResultType
    ) {}

    record FollowUpFeedbackRequest(
        @Min(1) @Max(5) Integer flowRating,
        @Min(1) @Max(5) Integer questionUiRating,
        @Min(1) @Max(5) Integer resultHelpfulnessRating,
        @Size(max = 5) List<@Size(max = 40) String> helpfulSections,
        @Size(max = 5) List<@Size(max = 40) String> resultIssues,
        @Size(max = 40) String shareIntent,
        @Size(max = 6) List<@Size(max = 40) String> errorAreas,
        @Size(max = 40) String environment,
        @Size(max = 1000) String comment
    ) {}

    record FollowUpFeedbackResponse(UUID attemptId, boolean submitted) {}
}
