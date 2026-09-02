package app.ongi.sharing.engagement;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    Optional<Visitor> findByVisitorKey(UUID visitorKey);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        INSERT INTO visitor (visitor_key, created_at, last_seen_at)
        VALUES (:visitorKey, :now, :now)
        ON CONFLICT (visitor_key)
        DO UPDATE SET last_seen_at = EXCLUDED.last_seen_at
        """, nativeQuery = true)
    int upsert(@Param("visitorKey") UUID visitorKey, @Param("now") java.time.Instant now);
}
