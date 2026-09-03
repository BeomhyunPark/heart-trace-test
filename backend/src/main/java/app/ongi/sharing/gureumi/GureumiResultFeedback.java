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
    private int rating;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected GureumiResultFeedback() {}

    public GureumiResultFeedback(UUID id, GureumiAttempt attempt, int rating, Instant now) {
        this.id = id;
        this.attempt = attempt;
        this.rating = rating;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(int rating, Instant now) {
        this.rating = rating;
        this.updatedAt = now;
    }

    public int getRating() { return rating; }
}
