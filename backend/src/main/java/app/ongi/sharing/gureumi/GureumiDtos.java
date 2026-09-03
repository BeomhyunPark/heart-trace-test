package app.ongi.sharing.gureumi;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

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

    record FeedbackRequest(@Min(1) @Max(4) int rating) {}

    record FeedbackResponse(UUID attemptId, int rating) {}
}
