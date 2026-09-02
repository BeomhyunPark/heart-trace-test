package app.ongi.sharing.engagement;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VisitRepository extends JpaRepository<Visit, Long> {

    @Query("select visit from Visit visit join fetch visit.visitor left join fetch visit.shareLink where visit.visitKey = :visitKey")
    Optional<Visit> findByVisitKeyWithRelations(@Param("visitKey") UUID visitKey);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        INSERT INTO visit (visitor_id, visit_key, share_link_id, started_at, last_seen_at)
        VALUES (:visitorId, :visitKey, :shareLinkId, :now, :now)
        ON CONFLICT (visit_key)
        DO UPDATE SET last_seen_at = EXCLUDED.last_seen_at
        """, nativeQuery = true)
    int upsert(
        @Param("visitorId") Long visitorId,
        @Param("visitKey") UUID visitKey,
        @Param("shareLinkId") Long shareLinkId,
        @Param("now") java.time.Instant now
    );
}
