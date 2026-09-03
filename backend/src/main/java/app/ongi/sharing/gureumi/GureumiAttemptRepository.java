package app.ongi.sharing.gureumi;

import java.util.Optional;
import java.util.UUID;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface GureumiAttemptRepository extends JpaRepository<GureumiAttempt, UUID> {
    Optional<GureumiAttempt> findByResumeTokenHash(String resumeTokenHash);

    Optional<GureumiAttempt> findByIdAndResumeTokenHash(UUID id, String resumeTokenHash);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select attempt from GureumiAttempt attempt where attempt.id = :id and attempt.resumeTokenHash = :tokenHash")
    Optional<GureumiAttempt> findAuthorizedForUpdate(@Param("id") UUID id, @Param("tokenHash") String tokenHash);
}
