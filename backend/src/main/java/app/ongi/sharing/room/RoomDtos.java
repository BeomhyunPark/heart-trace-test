package app.ongi.sharing.room;

import java.time.Instant;
import java.util.UUID;

import app.ongi.sharing.session.SessionRole;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class RoomDtos {
    private RoomDtos() {}

    public record CreateRoomRequest(@Size(max = 120) String title) {}

    public record CreateRoomResponse(
        UUID roomId,
        String roomCode,
        String title,
        RoomStatus status,
        long version,
        Instant expiresAt
    ) {}

    public record LockRoomRequest(@NotNull Long expectedVersion) {}

    public record CancelRoomResponse(boolean cancelled) {}

    public record RoomStateResponse(
        UUID roomId,
        String roomCode,
        String title,
        RoomStatus status,
        SessionRole role,
        long version,
        int participantCount,
        int completedParticipantCount,
        boolean participantJoined,
        boolean responseCompleted,
        int currentRound,
        int totalRounds,
        Instant expiresAt
    ) {}
}
