package app.ongi.sharing.engagement;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventLogRepository extends JpaRepository<EventLog, Long> {

    @Query("""
        select event from EventLog event
        join fetch event.visit
        left join fetch event.content
        where event.eventKey = :eventKey
        """)
    Optional<EventLog> findByEventKeyWithRelations(@Param("eventKey") UUID eventKey);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        INSERT INTO event_log (event_key, visit_id, content_id, event_type, data, created_at)
        VALUES (:eventKey, :visitId, :contentId, :eventType, CAST(:data AS jsonb), :createdAt)
        ON CONFLICT (event_key) DO NOTHING
        """, nativeQuery = true)
    int insertIfAbsent(
        @Param("eventKey") UUID eventKey,
        @Param("visitId") Long visitId,
        @Param("contentId") Long contentId,
        @Param("eventType") String eventType,
        @Param("data") String data,
        @Param("createdAt") java.time.Instant createdAt
    );
}
