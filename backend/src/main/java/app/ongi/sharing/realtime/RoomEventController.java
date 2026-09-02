package app.ongi.sharing.realtime;

import java.util.UUID;

import app.ongi.sharing.session.RoomAccess;
import app.ongi.sharing.session.RoomAuthorizationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/rooms/{roomId}")
public class RoomEventController {

    private final RoomAuthorizationService authorizationService;
    private final RoomEventPublisher eventPublisher;

    public RoomEventController(RoomAuthorizationService authorizationService, RoomEventPublisher eventPublisher) {
        this.authorizationService = authorizationService;
        this.eventPublisher = eventPublisher;
    }

    @GetMapping("/events")
    SseEmitter events(@PathVariable UUID roomId, HttpServletRequest request) {
        RoomAccess access = authorizationService.requireAny(request, roomId);
        return eventPublisher.subscribe(access.publicRoomId());
    }
}
