package app.ongi.sharing.gureumi;

import static app.ongi.sharing.gureumi.GureumiDtos.AttemptStateResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.CompletionResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.CreatedAttemptResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.FeedbackRequest;
import static app.ongi.sharing.gureumi.GureumiDtos.FeedbackResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.QuestionsResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.ResultResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.SaveAnswerRequest;

import java.util.UUID;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gureumi")
public class GureumiController {

    public static final String RESUME_HEADER = "X-Gureumi-Resume-Token";

    private final GureumiService service;

    public GureumiController(GureumiService service) {
        this.service = service;
    }

    @PostMapping("/attempts")
    CreatedAttemptResponse createAttempt(
        @RequestHeader(value = RESUME_HEADER, required = false) String previousResumeToken
    ) {
        return service.createAttempt(previousResumeToken);
    }

    @GetMapping("/attempts/current")
    AttemptStateResponse current(
        @RequestHeader(value = RESUME_HEADER, required = false) String resumeToken
    ) {
        return service.current(resumeToken);
    }

    @GetMapping("/attempts/{attemptId}/questions")
    QuestionsResponse questions(
        @PathVariable UUID attemptId,
        @RequestHeader(value = RESUME_HEADER, required = false) String resumeToken
    ) {
        return service.questions(attemptId, resumeToken);
    }

    @PutMapping("/attempts/{attemptId}/answers")
    AttemptStateResponse saveAnswer(
        @PathVariable UUID attemptId,
        @RequestHeader(value = RESUME_HEADER, required = false) String resumeToken,
        @Valid @RequestBody SaveAnswerRequest request
    ) {
        return service.saveAnswer(
            attemptId, resumeToken, request.questionId(), request.choice(), request.responseMs()
        );
    }

    @PostMapping("/attempts/{attemptId}/complete")
    CompletionResponse complete(
        @PathVariable UUID attemptId,
        @RequestHeader(value = RESUME_HEADER, required = false) String resumeToken
    ) {
        return service.complete(attemptId, resumeToken);
    }

    @GetMapping("/attempts/{attemptId}/result")
    ResultResponse result(
        @PathVariable UUID attemptId,
        @RequestHeader(value = RESUME_HEADER, required = false) String resumeToken
    ) {
        return service.result(attemptId, resumeToken);
    }

    @PutMapping("/attempts/{attemptId}/feedback")
    FeedbackResponse saveFeedback(
        @PathVariable UUID attemptId,
        @RequestHeader(value = RESUME_HEADER, required = false) String resumeToken,
        @Valid @RequestBody FeedbackRequest request
    ) {
        return service.saveFeedback(attemptId, resumeToken, request.rating());
    }
}
