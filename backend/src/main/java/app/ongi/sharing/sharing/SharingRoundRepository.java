package app.ongi.sharing.sharing;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SharingRoundRepository extends JpaRepository<SharingRound, UUID> {

    long countByRoomId(UUID roomId);

    @EntityGraph(attributePaths = "participant")
    Optional<SharingRound> findByRoomIdAndSequence(UUID roomId, int sequence);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        update SharingRound round
           set round.status = app.ongi.sharing.sharing.SharingStatus.REVEALED,
               round.revealedAt = :now
         where round.room.id = :roomId
           and round.sequence = :sequence
           and round.participant.id = :participantId
           and round.status = app.ongi.sharing.sharing.SharingStatus.ANONYMOUS
        """)
    int revealIfAnonymous(
        @Param("roomId") UUID roomId,
        @Param("sequence") int sequence,
        @Param("participantId") UUID participantId,
        @Param("now") Instant now
    );
}
