package app.ongi.sharing.participant;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import app.ongi.sharing.room.RoomStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class ParticipantDtos {
    private ParticipantDtos() {}

    public record JoinRoomRequest(
        @NotBlank @Size(max = 9) String roomCode,
        @NotBlank @Size(max = 40) String name
    ) {}

    public record JoinRoomResponse(
        UUID roomId,
        String title,
        RoomStatus status,
        ParticipantMe participant,
        Instant expiresAt
    ) {}

    public record ParticipantMe(UUID id, String name, boolean responseCompleted) {}

    public record ParticipantStatus(String name, boolean responseCompleted, Instant joinedAt) {}

    public record ParticipantListResponse(List<ParticipantStatus> participants) {}
}
