package app.ongi.sharing.response;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantResponseRepository extends JpaRepository<ParticipantResponse, UUID> {

    @EntityGraph(attributePaths = "question")
    List<ParticipantResponse> findAllByRoomIdAndParticipantIdOrderByQuestionPosition(UUID roomId, UUID participantId);

    Optional<ParticipantResponse> findByRoomIdAndParticipantIdAndQuestionId(UUID roomId, UUID participantId, UUID questionId);

    long countByRoomIdAndParticipantId(UUID roomId, UUID participantId);
}
