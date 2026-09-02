package app.ongi.sharing.response;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class ResponseDtos {
    private ResponseDtos() {}

    public record QuestionItem(UUID id, int position, String prompt, String helperText) {}

    public record QuestionListResponse(List<QuestionItem> questions) {}

    public record AnswerInput(@NotNull UUID questionId, @Size(max = 2000) String answer) {}

    public record SaveResponsesRequest(@NotNull @Valid List<AnswerInput> answers) {}

    public record SavedAnswer(UUID questionId, String answer) {}

    public record MyResponsesResponse(List<SavedAnswer> answers, boolean completed) {}
}
