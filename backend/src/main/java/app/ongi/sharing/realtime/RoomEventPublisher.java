package app.ongi.sharing.realtime;

import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import app.ongi.sharing.config.OngiProperties;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class RoomEventPublisher {

    private final ConcurrentHashMap<UUID, Set<SseEmitter>> emittersByRoom = new ConcurrentHashMap<>();
    private final OngiProperties properties;
    private final Clock clock;

    public RoomEventPublisher(OngiProperties properties, Clock clock) {
        this.properties = properties;
        this.clock = clock;
    }

    public SseEmitter subscribe(UUID publicRoomId) {
        SseEmitter emitter = new SseEmitter(properties.realtime().timeout().toMillis());
        Set<SseEmitter> roomEmitters = emittersByRoom.computeIfAbsent(publicRoomId, ignored -> ConcurrentHashMap.newKeySet());
        roomEmitters.add(emitter);
        emitter.onCompletion(() -> remove(publicRoomId, emitter));
        emitter.onTimeout(() -> remove(publicRoomId, emitter));
        emitter.onError(ignored -> remove(publicRoomId, emitter));
        try {
            emitter.send(SseEmitter.event().name("CONNECTED").data(new EventPayload("CONNECTED", null, clock.instant())));
        } catch (IOException exception) {
            remove(publicRoomId, emitter);
            emitter.completeWithError(exception);
        }
        return emitter;
    }

    public void publishAfterCommit(UUID publicRoomId, RoomEventType type, Long roomVersion) {
        Runnable publish = () -> publish(publicRoomId, type, roomVersion);
        if (TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    publish.run();
                }
            });
        } else {
            publish.run();
        }
    }

    @Scheduled(fixedDelayString = "${ongi.realtime.heartbeat:20s}")
    void heartbeat() {
        emittersByRoom.forEach((roomId, emitters) -> emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().comment("heartbeat"));
            } catch (IOException exception) {
                remove(roomId, emitter);
            }
        }));
    }

    private void publish(UUID publicRoomId, RoomEventType type, Long roomVersion) {
        Set<SseEmitter> emitters = emittersByRoom.get(publicRoomId);
        if (emitters == null) {
            return;
        }
        EventPayload payload = new EventPayload(type.name(), roomVersion, clock.instant());
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name(type.name()).data(payload));
                if (isTerminal(type)) {
                    emitter.complete();
                }
            } catch (IOException exception) {
                remove(publicRoomId, emitter);
            }
        });
        if (isTerminal(type)) {
            emittersByRoom.remove(publicRoomId);
        }
    }

    private boolean isTerminal(RoomEventType type) {
        return type == RoomEventType.ROOM_COMPLETED || type == RoomEventType.ROOM_CANCELLED;
    }

    private void remove(UUID publicRoomId, SseEmitter emitter) {
        Set<SseEmitter> emitters = emittersByRoom.get(publicRoomId);
        if (emitters == null) {
            return;
        }
        emitters.remove(emitter);
        if (emitters.isEmpty()) {
            emittersByRoom.remove(publicRoomId, emitters);
        }
    }

    int subscriberCount(UUID publicRoomId) {
        Set<SseEmitter> emitters = emittersByRoom.get(publicRoomId);
        return emitters == null ? 0 : emitters.size();
    }

    public record EventPayload(String type, Long roomVersion, Instant occurredAt) {}
}
