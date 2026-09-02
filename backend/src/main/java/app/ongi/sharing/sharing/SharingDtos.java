package app.ongi.sharing.sharing;

import java.util.List;
import java.time.Instant;
import app.ongi.sharing.room.RoomStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public final class SharingDtos {
    private SharingDtos() {}

    public record VersionRequest(@NotNull Long expectedVersion) {}

    public record NextRoundRequest(
        @NotNull Long expectedVersion,
        @NotNull @Min(0) Integer expectedRound
    ) {}

    public enum PublicSharingState {
        ANONYMOUS,
        REVEALED,
        FINISHED
    }

    public record SharedAnswer(String question, String answer) {}

    public record CurrentSharingResponse(
        PublicSharingState state,
        Integer sequence,
        int total,
        List<SharedAnswer> answers,
        String participantName,
        boolean canReveal,
        long roomVersion
    ) {}

    public record CompletedRoomResponse(RoomStatus status, Instant completedAt, long roomVersion) {}
}
