package app.ongi.sharing.retention;

import java.time.Clock;
import java.time.Instant;

import app.ongi.sharing.config.OngiProperties;
import app.ongi.sharing.room.RoomRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoomRetentionService {

    private final RoomRepository roomRepository;
    private final OngiProperties properties;
    private final Clock clock;

    public RoomRetentionService(RoomRepository roomRepository, OngiProperties properties, Clock clock) {
        this.roomRepository = roomRepository;
        this.properties = properties;
        this.clock = clock;
    }

    @Scheduled(fixedDelayString = "${ONGI_CLEANUP_INTERVAL:1m}")
    @Transactional
    public void deleteExpiredData() {
        Instant now = clock.instant();
        roomRepository.deleteExpiredActiveRooms(now);
        roomRepository.deleteCompletedTombstones(now.minus(properties.session().tombstoneRetention()));
    }
}
