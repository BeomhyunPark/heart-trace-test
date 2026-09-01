package app.ongi.sharing.config;

import java.time.Duration;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("ongi")
public record OngiProperties(
    List<String> allowedOrigins,
    Session session,
    Room room,
    Realtime realtime,
    RateLimit rateLimit
) {
    public record Session(boolean secureCookie, Duration tombstoneRetention) {}

    public record Room(Duration activeLifetime, int minimumParticipants, int maximumParticipants) {}

    public record Realtime(Duration timeout, Duration heartbeat) {}

    public record RateLimit(
        int attemptsPerMinute,
        int attemptsPerCodePerMinute,
        boolean trustCloudflareConnectingIp
    ) {}
}
