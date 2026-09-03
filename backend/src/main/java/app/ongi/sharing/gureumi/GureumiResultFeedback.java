package app.ongi.sharing.gureumi;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "gureumi_result_feedback")
public class GureumiResultFeedback {

    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false, unique = true)
    private GureumiAttempt attempt;

    @Column(nullable = false)
    private Integer rating;

    @Column(name = "confusing_question_orders", length = 128)
    private String confusingQuestionOrders;

    @Column(name = "self_selected_result_type", length = 16)
    private String selfSelectedResultType;

    @Column(name = "flow_rating")
    private Integer flowRating;

    @Column(name = "question_ui_rating")
    private Integer questionUiRating;

    @Column(name = "result_helpfulness_rating")
    private Integer resultHelpfulnessRating;

    @Column(name = "helpful_sections", length = 256)
    private String helpfulSections;

    @Column(name = "result_issues", length = 256)
    private String resultIssues;

    @Column(name = "share_intent", length = 64)
    private String shareIntent;

    @Column(name = "error_areas", length = 256)
    private String errorAreas;

    @Column(length = 64)
    private String environment;

    @Column(name = "free_comment", length = 1000)
    private String comment;

    @Column(name = "follow_up_submitted_at")
    private Instant followUpSubmittedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected GureumiResultFeedback() {}

    public GureumiResultFeedback(UUID id, GureumiAttempt attempt, Instant now) {
        this.id = id;
        this.attempt = attempt;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void updateQuick(
        Integer rating,
        String confusingQuestionOrders,
        GureumiResultType selfSelectedResultType,
        Instant now
    ) {
        this.rating = rating;
        this.confusingQuestionOrders = confusingQuestionOrders;
        this.selfSelectedResultType = selfSelectedResultType == null ? null : selfSelectedResultType.name();
        this.updatedAt = now;
    }

    public void updateFollowUp(
        Integer flowRating,
        Integer questionUiRating,
        Integer resultHelpfulnessRating,
        String helpfulSections,
        String resultIssues,
        String shareIntent,
        String errorAreas,
        String environment,
        String comment,
        Instant now
    ) {
        this.flowRating = flowRating;
        this.questionUiRating = questionUiRating;
        this.resultHelpfulnessRating = resultHelpfulnessRating;
        this.helpfulSections = helpfulSections;
        this.resultIssues = resultIssues;
        this.shareIntent = shareIntent;
        this.errorAreas = errorAreas;
        this.environment = environment;
        this.comment = comment;
        this.followUpSubmittedAt = now;
        this.updatedAt = now;
    }

    public Integer getRating() { return rating; }
}
