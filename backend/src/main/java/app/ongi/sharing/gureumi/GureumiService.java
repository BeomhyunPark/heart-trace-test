package app.ongi.sharing.gureumi;

import static app.ongi.sharing.gureumi.GureumiDtos.AttemptStateResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.CompletionResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.CreatedAttemptResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.FeedbackResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.FeedbackRequest;
import static app.ongi.sharing.gureumi.GureumiDtos.FollowUpFeedbackRequest;
import static app.ongi.sharing.gureumi.GureumiDtos.FollowUpFeedbackResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.QuestionResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.QuestionsResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.ResultResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.SavedAnswerResponse;
import static app.ongi.sharing.gureumi.GureumiDtos.TraitAxisResponse;

import java.time.Clock;
import java.time.Instant;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import app.ongi.sharing.common.ApiException;
import app.ongi.sharing.session.SessionTokenService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GureumiService {

    static final int QUESTION_COUNT = 27;
    static final int QUESTIONS_PER_AXIS = 9;

    private final GureumiTestVersionRepository versionRepository;
    private final GureumiQuestionRepository questionRepository;
    private final GureumiAttemptRepository attemptRepository;
    private final GureumiAnswerRepository answerRepository;
    private final GureumiResultFeedbackRepository feedbackRepository;
    private final SessionTokenService tokenService;
    private final GureumiScoring scoring;
    private final Clock clock;

    public GureumiService(
        GureumiTestVersionRepository versionRepository,
        GureumiQuestionRepository questionRepository,
        GureumiAttemptRepository attemptRepository,
        GureumiAnswerRepository answerRepository,
        GureumiResultFeedbackRepository feedbackRepository,
        SessionTokenService tokenService,
        GureumiScoring scoring,
        Clock clock
    ) {
        this.versionRepository = versionRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.answerRepository = answerRepository;
        this.feedbackRepository = feedbackRepository;
        this.tokenService = tokenService;
        this.scoring = scoring;
        this.clock = clock;
    }

    @Transactional
    public CreatedAttemptResponse createAttempt(String previousResumeToken) {
        GureumiAttempt previous = null;
        if (previousResumeToken != null && !previousResumeToken.isBlank()) {
            previous = attemptRepository.findByResumeTokenHash(tokenService.hash(previousResumeToken))
                .orElseThrow(this::resumeRequired);
            if (!previous.isCompleted()) {
                return createdResponse(previous, previousResumeToken);
            }
        }

        GureumiTestVersion activeVersion = versionRepository
            .findFirstByStatusOrderByCreatedAtDesc(GureumiVersionStatus.ACTIVE)
            .orElseThrow(() -> new ApiException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "GUREUMI_VERSION_UNAVAILABLE",
                "지금은 구르미 테스트를 시작할 수 없어요. 잠시 후 다시 시도해주세요."
            ));
        requireValidQuestionSet(activeVersion.getId());

        String rawToken = tokenService.createToken();
        int attemptNo = previous == null ? 1 : previous.getAttemptNo() + 1;
        GureumiAttempt attempt = new GureumiAttempt(
            UUID.randomUUID(),
            activeVersion,
            tokenService.hash(rawToken),
            previous,
            attemptNo,
            clock.instant()
        );
        attemptRepository.save(attempt);
        return createdResponse(attempt, rawToken);
    }

    @Transactional(readOnly = true)
    public AttemptStateResponse current(String resumeToken) {
        GureumiAttempt attempt = attemptRepository.findByResumeTokenHash(hashRequired(resumeToken))
            .orElseThrow(this::resumeRequired);
        return stateResponse(attempt);
    }

    @Transactional(readOnly = true)
    public QuestionsResponse questions(UUID attemptId, String resumeToken) {
        GureumiAttempt attempt = requireAttempt(attemptId, resumeToken);
        List<QuestionResponse> questions = questionRepository
            .findAllByVersion_IdAndActiveTrueOrderByOrderNo(attempt.getTestVersion().getId())
            .stream()
            .map(question -> new QuestionResponse(
                question.getId(),
                question.getOrderNo(),
                question.getPrompt(),
                question.getOptionA(),
                question.getOptionB()
            ))
            .toList();
        if (questions.size() != QUESTION_COUNT) {
            throw configurationError();
        }
        return new QuestionsResponse(attempt.getTestVersion().getCode(), questions);
    }

    @Transactional
    public AttemptStateResponse saveAnswer(
        UUID attemptId,
        String resumeToken,
        UUID questionId,
        GureumiChoice choice,
        Integer responseMs
    ) {
        GureumiAttempt attempt = requireAttemptForUpdate(attemptId, resumeToken);
        if (attempt.isCompleted()) {
            throw new ApiException(HttpStatus.CONFLICT, "ATTEMPT_ALREADY_COMPLETED", "완료된 테스트의 답변은 바꿀 수 없어요.");
        }

        GureumiQuestion question = questionRepository
            .findByIdAndVersion_IdAndActiveTrue(questionId, attempt.getTestVersion().getId())
            .orElseThrow(() -> new ApiException(
                HttpStatus.BAD_REQUEST,
                "INVALID_GUREUMI_QUESTION",
                "현재 테스트 버전에 속한 문항이 아니에요."
            ));
        int answerScore = scoring.score(choice, question.getHighSide());
        Instant now = clock.instant();
        GureumiAnswer answer = answerRepository
            .findByAttempt_IdAndQuestion_Id(attemptId, questionId)
            .orElseGet(() -> new GureumiAnswer(
                UUID.randomUUID(), attempt, question, choice, answerScore, responseMs, now
            ));
        answer.update(choice, answerScore, responseMs, now);
        answerRepository.save(answer);
        return stateResponse(attempt);
    }

    @Transactional
    public CompletionResponse complete(UUID attemptId, String resumeToken) {
        GureumiAttempt attempt = requireAttemptForUpdate(attemptId, resumeToken);
        if (attempt.isCompleted()) {
            return completionResponse(attempt);
        }

        List<GureumiQuestion> questions = questionRepository
            .findAllByVersion_IdAndActiveTrueOrderByOrderNo(attempt.getTestVersion().getId());
        List<GureumiAnswer> answers = answerRepository.findAllByAttempt_IdOrderByQuestion_OrderNo(attemptId);
        if (questions.size() != QUESTION_COUNT) {
            throw configurationError();
        }
        if (answers.size() != QUESTION_COUNT) {
            throw new ApiException(
                HttpStatus.CONFLICT,
                "GUREUMI_ANSWERS_INCOMPLETE",
                "27개 문항에 모두 답한 뒤 결과를 확인할 수 있어요."
            );
        }

        Set<UUID> expectedIds = questions.stream().map(GureumiQuestion::getId).collect(java.util.stream.Collectors.toSet());
        Set<UUID> answeredIds = new HashSet<>();
        Map<TraitAxis, Integer> scores = new EnumMap<>(TraitAxis.class);
        Map<TraitAxis, Integer> counts = new EnumMap<>(TraitAxis.class);
        for (GureumiAnswer answer : answers) {
            GureumiQuestion question = answer.getQuestion();
            if (!question.getVersion().getId().equals(attempt.getTestVersion().getId())
                || !expectedIds.contains(question.getId())
                || !answeredIds.add(question.getId())) {
                throw new ApiException(HttpStatus.CONFLICT, "GUREUMI_ANSWER_INTEGRITY_ERROR", "답변 구성을 확인할 수 없어요.");
            }
            int authoritativeScore = scoring.score(answer.getChoice(), question.getHighSide());
            scores.merge(question.getAxis(), authoritativeScore, Integer::sum);
            counts.merge(question.getAxis(), 1, Integer::sum);
        }
        if (counts.values().stream().mapToInt(Integer::intValue).sum() != QUESTION_COUNT
            || counts.values().stream().anyMatch(count -> count != QUESTIONS_PER_AXIS)
            || counts.size() != TraitAxis.values().length) {
            throw configurationError();
        }

        GureumiScoring.AxisResult novelty = scoring.classify(scores.get(TraitAxis.NOVELTY));
        GureumiScoring.AxisResult worry = scoring.classify(scores.get(TraitAxis.WORRY));
        GureumiScoring.AxisResult relation = scoring.classify(scores.get(TraitAxis.RELATION));
        GureumiResultType resultType = scoring.resultFor(novelty.level(), worry.level(), relation.level());
        attempt.complete(novelty, worry, relation, resultType, clock.instant());
        attemptRepository.save(attempt);
        return completionResponse(attempt);
    }

    @Transactional(readOnly = true)
    public ResultResponse result(UUID attemptId, String resumeToken) {
        GureumiAttempt attempt = requireAttempt(attemptId, resumeToken);
        if (!attempt.isCompleted()) {
            throw new ApiException(HttpStatus.CONFLICT, "GUREUMI_RESULT_NOT_READY", "27개 문항을 완료한 뒤 결과를 볼 수 있어요.");
        }
        Integer feedbackRating = feedbackRepository.findByAttempt_Id(attemptId)
            .map(GureumiResultFeedback::getRating)
            .orElse(null);
        GureumiResultType resultType = attempt.getResultType();
        return new ResultResponse(
            attempt.getId(),
            attempt.getTestVersion().getCode(),
            resultType.name(),
            resultType.characterKey(),
            resultType.displayName(),
            List.of(
                new TraitAxisResponse("NOVELTY", "새로움", attempt.getNoveltyLevel()),
                new TraitAxisResponse("WORRY", "걱정", attempt.getWorryLevel()),
                new TraitAxisResponse("RELATION", "관계", attempt.getRelationLevel())
            ),
            feedbackRating
        );
    }

    @Transactional
    public FeedbackResponse saveFeedback(UUID attemptId, String resumeToken, FeedbackRequest request) {
        GureumiAttempt attempt = requireAttemptForUpdate(attemptId, resumeToken);
        if (!attempt.isCompleted()) {
            throw new ApiException(HttpStatus.CONFLICT, "GUREUMI_RESULT_NOT_READY", "결과를 확인한 뒤 만족도를 남길 수 있어요.");
        }
        List<Integer> confusingOrders = request.confusingQuestionOrders() == null
            ? List.of()
            : request.confusingQuestionOrders().stream().distinct().sorted().toList();
        Instant now = clock.instant();
        GureumiResultFeedback feedback = feedbackRepository.findByAttempt_Id(attemptId)
            .orElseGet(() -> new GureumiResultFeedback(UUID.randomUUID(), attempt, now));
        feedback.updateQuick(
            request.rating(),
            joinValues(confusingOrders.stream().map(String::valueOf).toList()),
            request.selfSelectedResultType(),
            now
        );
        feedbackRepository.save(feedback);
        return new FeedbackResponse(
            attemptId,
            request.rating(),
            confusingOrders,
            request.selfSelectedResultType() == null ? null : request.selfSelectedResultType().name()
        );
    }

    @Transactional
    public FollowUpFeedbackResponse saveFollowUpFeedback(
        UUID attemptId,
        String resumeToken,
        FollowUpFeedbackRequest request
    ) {
        GureumiAttempt attempt = requireAttemptForUpdate(attemptId, resumeToken);
        if (!attempt.isCompleted()) {
            throw new ApiException(HttpStatus.CONFLICT, "GUREUMI_RESULT_NOT_READY", "결과를 확인한 뒤 설문을 남길 수 있어요.");
        }
        Instant now = clock.instant();
        GureumiResultFeedback feedback = feedbackRepository.findByAttempt_Id(attemptId)
            .orElseGet(() -> new GureumiResultFeedback(UUID.randomUUID(), attempt, now));
        feedback.updateFollowUp(
            request.flowRating(),
            request.questionUiRating(),
            request.resultHelpfulnessRating(),
            joinValues(request.helpfulSections()),
            joinValues(request.resultIssues()),
            clean(request.shareIntent()),
            joinValues(request.errorAreas()),
            clean(request.environment()),
            clean(request.comment()),
            now
        );
        feedbackRepository.save(feedback);
        return new FollowUpFeedbackResponse(attemptId, true);
    }

    private String joinValues(List<?> values) {
        if (values == null || values.isEmpty()) return null;
        return values.stream().map(String::valueOf).map(String::trim).filter(value -> !value.isBlank())
            .collect(Collectors.joining("|"));
    }

    private String clean(String value) {
        if (value == null || value.isBlank()) return null;
        return value.trim();
    }

    private void requireValidQuestionSet(UUID versionId) {
        List<GureumiQuestion> questions = questionRepository.findAllByVersion_IdAndActiveTrueOrderByOrderNo(versionId);
        Set<Integer> expectedOrders = IntStream.rangeClosed(1, QUESTION_COUNT).boxed().collect(Collectors.toSet());
        Set<Integer> actualOrders = questions.stream().map(GureumiQuestion::getOrderNo).collect(Collectors.toSet());
        if (questions.size() != QUESTION_COUNT
            || !actualOrders.equals(expectedOrders)
            || questions.stream().collect(java.util.stream.Collectors.groupingBy(
                GureumiQuestion::getAxis,
                () -> new EnumMap<>(TraitAxis.class),
                java.util.stream.Collectors.counting()
            )).values().stream().anyMatch(count -> count != QUESTIONS_PER_AXIS)) {
            throw configurationError();
        }
    }

    private AttemptStateResponse stateResponse(GureumiAttempt attempt) {
        List<SavedAnswerResponse> answers = answerRepository
            .findAllByAttempt_IdOrderByQuestion_OrderNo(attempt.getId())
            .stream()
            .map(answer -> new SavedAnswerResponse(answer.getQuestion().getId(), answer.getChoice()))
            .toList();
        Set<UUID> answeredIds = answers.stream().map(SavedAnswerResponse::questionId).collect(java.util.stream.Collectors.toSet());
        int nextOrder = questionRepository
            .findAllByVersion_IdAndActiveTrueOrderByOrderNo(attempt.getTestVersion().getId())
            .stream()
            .filter(question -> !answeredIds.contains(question.getId()))
            .mapToInt(GureumiQuestion::getOrderNo)
            .findFirst()
            .orElse(QUESTION_COUNT);
        return new AttemptStateResponse(
            attempt.getId(),
            attempt.getTestVersion().getCode(),
            attempt.getAttemptNo(),
            attempt.isCompleted(),
            answers.size(),
            nextOrder,
            answers,
            attempt.getStartedAt(),
            attempt.getCompletedAt()
        );
    }

    private CreatedAttemptResponse createdResponse(GureumiAttempt attempt, String rawToken) {
        return new CreatedAttemptResponse(
            attempt.getId(), rawToken, attempt.getTestVersion().getCode(), attempt.getAttemptNo(), attempt.getStartedAt()
        );
    }

    private CompletionResponse completionResponse(GureumiAttempt attempt) {
        return new CompletionResponse(
            attempt.getId(), true, attempt.getResultType().name(), attempt.getResultType().characterKey()
        );
    }

    private GureumiAttempt requireAttempt(UUID attemptId, String resumeToken) {
        return attemptRepository.findByIdAndResumeTokenHash(attemptId, hashRequired(resumeToken))
            .orElseThrow(this::resumeRequired);
    }

    private GureumiAttempt requireAttemptForUpdate(UUID attemptId, String resumeToken) {
        return attemptRepository.findAuthorizedForUpdate(attemptId, hashRequired(resumeToken))
            .orElseThrow(this::resumeRequired);
    }

    private String hashRequired(String resumeToken) {
        if (resumeToken == null || resumeToken.isBlank()) {
            throw resumeRequired();
        }
        return tokenService.hash(resumeToken);
    }

    private ApiException resumeRequired() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "GUREUMI_RESUME_REQUIRED", "이 기기에서 진행하던 구르미 테스트를 찾을 수 없어요.");
    }

    private ApiException configurationError() {
        return new ApiException(
            HttpStatus.SERVICE_UNAVAILABLE,
            "GUREUMI_QUESTION_SET_INVALID",
            "구르미 문항 구성을 확인하는 중이에요. 잠시 후 다시 시도해주세요."
        );
    }
}
