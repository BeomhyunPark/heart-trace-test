package app.ongi.sharing.gureumi;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "gureumi_answer")
public class GureumiAnswer {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false)
    private GureumiAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private GureumiQuestion question;

    @Column(name = "version_id", nullable = false)
    private UUID versionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private GureumiChoice choice;

    @Column(nullable = false)
    private int score;

    @Column(name = "response_ms")
    private Integer responseMs;

    @Column(name = "answered_at", nullable = false)
    private Instant answeredAt;

    protected GureumiAnswer() {}

    public GureumiAnswer(
        UUID id,
        GureumiAttempt attempt,
        GureumiQuestion question,
        GureumiChoice choice,
        int score,
        Integer responseMs,
        Instant answeredAt
    ) {
        this.id = id;
        this.attempt = attempt;
        this.question = question;
        this.versionId = attempt.getTestVersion().getId();
        update(choice, score, responseMs, answeredAt);
    }

    public void update(GureumiChoice choice, int score, Integer responseMs, Instant answeredAt) {
        this.choice = choice;
        this.score = score;
        this.responseMs = responseMs;
        this.answeredAt = answeredAt;
    }

    public GureumiQuestion getQuestion() { return question; }
    public GureumiChoice getChoice() { return choice; }
    public int getScore() { return score; }
    public Integer getResponseMs() { return responseMs; }
}

enum GureumiChoice {
    A_VERY,
    A_LITTLE,
    B_LITTLE,
    B_VERY
}
