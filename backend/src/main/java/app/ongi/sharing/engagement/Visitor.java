package app.ongi.sharing.engagement;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "visitor")
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "visitor_key", nullable = false, unique = true)
    private UUID visitorKey;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "last_seen_at", nullable = false)
    private Instant lastSeenAt;

    protected Visitor() {}

    public Visitor(UUID visitorKey, Instant now) {
        this.visitorKey = visitorKey;
        this.createdAt = now;
        this.lastSeenAt = now;
    }

    public void touch(Instant now) {
        lastSeenAt = now;
    }

    public Long getId() { return id; }
    public UUID getVisitorKey() { return visitorKey; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getLastSeenAt() { return lastSeenAt; }
}
