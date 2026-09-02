package app.ongi.sharing.engagement;

import java.util.Optional;
import java.util.UUID;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    @Query("""
        select participation from Participation participation
        join fetch participation.visit visit
        join fetch visit.visitor
        join fetch participation.version version
        join fetch version.content
        left join fetch participation.result
        where participation.requestKey = :requestKey
        """)
    Optional<Participation> findByRequestKeyWithRelations(@Param("requestKey") UUID requestKey);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select participation from Participation participation
        join fetch participation.visit visit
        join fetch visit.visitor
        join fetch participation.version version
        join fetch version.content
        left join fetch participation.result
        where participation.id = :participationId
        """)
    Optional<Participation> findByIdForUpdate(@Param("participationId") Long participationId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        INSERT INTO participation (visit_id, version_id, request_key, started_at)
        VALUES (:visitId, :versionId, :requestKey, :startedAt)
        ON CONFLICT (request_key) DO NOTHING
        """, nativeQuery = true)
    int insertIfAbsent(
        @Param("visitId") Long visitId,
        @Param("versionId") Long versionId,
        @Param("requestKey") UUID requestKey,
        @Param("startedAt") java.time.Instant startedAt
    );
}
