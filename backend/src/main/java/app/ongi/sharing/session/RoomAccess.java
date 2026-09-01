package app.ongi.sharing.session;

import java.util.UUID;

public record RoomAccess(UUID roomId, UUID publicRoomId, SessionRole role, UUID participantId) {}
