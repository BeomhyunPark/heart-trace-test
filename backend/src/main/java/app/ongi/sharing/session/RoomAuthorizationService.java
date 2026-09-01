package app.ongi.sharing.session;

import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

import app.ongi.sharing.common.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoomAuthorizationService {

    private final RoomSessionRepository sessionRepository;
    private final SessionCookieService cookieService;
    private final SessionTokenService tokenService;
    private final Clock clock;

    public RoomAuthorizationService(RoomSessionRepository sessionRepository, SessionCookieService cookieService, SessionTokenService tokenService, Clock clock) {
        this.sessionRepository = sessionRepository;
        this.cookieService = cookieService;
        this.tokenService = tokenService;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public RoomAccess requireAny(HttpServletRequest request, UUID publicRoomId) {
        RoomAccess host = resolve(request, publicRoomId, SessionRole.HOST);
        RoomAccess participant = resolve(request, publicRoomId, SessionRole.PARTICIPANT);
        if (host != null) {
            return new RoomAccess(
                host.roomId(), host.publicRoomId(), SessionRole.HOST,
                participant == null ? null : participant.participantId()
            );
        }
        if (participant != null) {
            return participant;
        }
        throw unauthorized();
    }

    @Transactional(readOnly = true)
    public RoomAccess requireHost(HttpServletRequest request, UUID publicRoomId) {
        RoomAccess host = require(request, publicRoomId, SessionRole.HOST);
        RoomAccess participant = resolve(request, publicRoomId, SessionRole.PARTICIPANT);
        return new RoomAccess(
            host.roomId(), host.publicRoomId(), SessionRole.HOST,
            participant == null ? null : participant.participantId()
        );
    }

    @Transactional(readOnly = true)
    public RoomAccess requireParticipant(HttpServletRequest request, UUID publicRoomId) {
        RoomAccess access = require(request, publicRoomId, SessionRole.PARTICIPANT);
        if (access.participantId() == null) {
            throw unauthorized();
        }
        return access;
    }

    private RoomAccess require(HttpServletRequest request, UUID publicRoomId, SessionRole role) {
        RoomAccess access = resolve(request, publicRoomId, role);
        if (access == null) {
            throw unauthorized();
        }
        return access;
    }

    private RoomAccess resolve(HttpServletRequest request, UUID publicRoomId, SessionRole role) {
        String token = cookieService.read(request, role).orElse(null);
        if (token == null) {
            return null;
        }
        RoomSession session = sessionRepository
            .findByTokenHashAndRoomPublicId(tokenService.hash(token), publicRoomId)
            .orElse(null);
        Instant now = clock.instant();
        if (session == null || session.getRole() != role || session.isExpired(now)) {
            return null;
        }
        if (session.getRoom().getStatus() != app.ongi.sharing.room.RoomStatus.COMPLETED
            && session.getRoom().isExpired(now)) {
            return null;
        }
        return new RoomAccess(
            session.getRoom().getId(),
            session.getRoom().getPublicId(),
            role,
            session.getParticipant() == null ? null : session.getParticipant().getId()
        );
    }

    private ApiException unauthorized() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "ROOM_SESSION_REQUIRED", "이 모임에 다시 참여해주세요.");
    }
}
