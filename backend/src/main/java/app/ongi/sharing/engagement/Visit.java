package app.ongi.sharing.engagement;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "visit")
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "visitor_id", nullable = false)
    private Visitor visitor;

    @Column(name = "visit_key", nullable = false, unique = true)
    private UUID visitKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "share_link_id")
    private ShareLink shareLink;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "last_seen_at", nullable = false)
    private Instant lastSeenAt;

    protected Visit() {}

    public Visit(Visitor visitor, UUID visitKey, ShareLink shareLink, Instant now) {
        this.visitor = visitor;
        this.visitKey = visitKey;
        this.shareLink = shareLink;
        this.startedAt = now;
        this.lastSeenAt = now;
    }

    public void touch(Instant now) {
        lastSeenAt = now;
    }

    public Long getId() { return id; }
    public Visitor getVisitor() { return visitor; }
    public UUID getVisitKey() { return visitKey; }
    public ShareLink getShareLink() { return shareLink; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getLastSeenAt() { return lastSeenAt; }
}
