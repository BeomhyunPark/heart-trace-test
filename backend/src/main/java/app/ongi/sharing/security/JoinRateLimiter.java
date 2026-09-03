package app.ongi.sharing.security;

import java.time.Clock;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

import app.ongi.sharing.common.RateLimitException;
import app.ongi.sharing.config.OngiProperties;
import app.ongi.sharing.room.RoomCodeGenerator;
import app.ongi.sharing.session.SessionTokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class JoinRateLimiter {

    private static final long WINDOW_SECONDS = 60;
    private static final Pattern IP_ADDRESS = Pattern.compile("^[0-9a-fA-F:.]{2,45}$");

    private final Map<String, Window> windows = new ConcurrentHashMap<>();
    private final OngiProperties properties;
    private final SessionTokenService tokenService;
    private final Clock clock;
    private final String processSalt;

    public JoinRateLimiter(OngiProperties properties, SessionTokenService tokenService, Clock clock) {
        this.properties = properties;
        this.tokenService = tokenService;
        this.clock = clock;
        this.processSalt = tokenService.createToken();
    }

    public void check(HttpServletRequest request, String rawRoomCode) {
        String source = sourceAddress(request);
        String sourceHash = tokenService.hash(processSalt + ":" + source);
        long window = clock.instant().getEpochSecond() / WINDOW_SECONDS;
        consume(
            "source-code:" + sourceHash + ":" + RoomCodeGenerator.normalize(rawRoomCode),
            properties.rateLimit().attemptsPerCodePerMinute(),
            window
        );
    }

    @Scheduled(fixedDelay = 60_000)
    void removeExpiredWindows() {
        long currentWindow = clock.instant().getEpochSecond() / WINDOW_SECONDS;
        windows.entrySet().removeIf(entry -> entry.getValue().window < currentWindow);
    }

    private void consume(String key, int limit, long currentWindow) {
        Window result = windows.compute(key, (ignored, existing) -> {
            if (existing == null || existing.window != currentWindow) {
                return new Window(currentWindow, 1);
            }
            return new Window(currentWindow, existing.count + 1);
        });
        if (result.count > limit) {
            long retryAfter = WINDOW_SECONDS - (clock.instant().getEpochSecond() % WINDOW_SECONDS);
            throw new RateLimitException(Math.max(1, retryAfter));
        }
    }

    private String sourceAddress(HttpServletRequest request) {
        if (properties.rateLimit().trustCloudflareConnectingIp()) {
            String connectingIp = request.getHeader("CF-Connecting-IP");
            if (connectingIp != null && IP_ADDRESS.matcher(connectingIp.strip()).matches()) {
                return connectingIp.strip();
            }
        }
        return request.getRemoteAddr() == null ? "unknown" : request.getRemoteAddr();
    }

    private record Window(long window, int count) {}
}
