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
@Table(name = "participation")
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "visit_id", nullable = false)
    private Visit visit;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "version_id", nullable = false)
    private ContentVersion version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id")
    private ContentResult result;

    @Column(name = "request_key", nullable = false, unique = true)
    private UUID requestKey;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    protected Participation() {}

    public Participation(Visit visit, ContentVersion version, UUID requestKey, Instant startedAt) {
        this.visit = visit;
        this.version = version;
        this.requestKey = requestKey;
        this.startedAt = startedAt;
    }

    public void complete(ContentResult result, Instant now) {
        this.result = result;
        this.completedAt = now;
    }

    public Long getId() { return id; }
    public Visit getVisit() { return visit; }
    public ContentVersion getVersion() { return version; }
    public ContentResult getResult() { return result; }
    public UUID getRequestKey() { return requestKey; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getCompletedAt() { return completedAt; }
}
