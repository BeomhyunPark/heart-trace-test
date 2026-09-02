package app.ongi.sharing.participant;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ParticipantRepository extends JpaRepository<Participant, UUID> {
    long countByRoomId(UUID roomId);
    long countByRoomIdAndResponseCompletedTrue(UUID roomId);
    List<Participant> findAllByRoomIdOrderByJoinedAt(UUID roomId);
    Optional<Participant> findByIdAndRoomId(UUID participantId, UUID roomId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from Participant participant where participant.room.id = :roomId")
    int deleteAllByRoomId(@Param("roomId") UUID roomId);
}
