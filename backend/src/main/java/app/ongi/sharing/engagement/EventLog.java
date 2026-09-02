package app.ongi.sharing.engagement;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "event_log")
public class EventLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_key", nullable = false, unique = true)
    private UUID eventKey;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "visit_id", nullable = false)
    private Visit visit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id")
    private Content content;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 24)
    private EngagementEventType eventType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private Map<String, String> data;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected EventLog() {}

    public EventLog(UUID eventKey, Visit visit, Content content, EngagementEventType eventType, Map<String, String> data, Instant createdAt) {
        this.eventKey = eventKey;
        this.visit = visit;
        this.content = content;
        this.eventType = eventType;
        this.data = Map.copyOf(data);
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public UUID getEventKey() { return eventKey; }
    public Visit getVisit() { return visit; }
    public Content getContent() { return content; }
    public EngagementEventType getEventType() { return eventType; }
    public Map<String, String> getData() { return data; }
    public Instant getCreatedAt() { return createdAt; }
}
