package app.ongi.sharing.session;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import app.ongi.sharing.config.OngiProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class SessionCookieService {

    public static final String HOST_COOKIE = "ongi_host_session";
    public static final String PARTICIPANT_COOKIE = "ongi_participant_session";

    private final OngiProperties properties;

    public SessionCookieService(OngiProperties properties) {
        this.properties = properties;
    }

    public ResponseCookie create(SessionRole role, String token, UUID publicRoomId, Instant expiresAt, Instant now) {
        String name = role == SessionRole.HOST ? HOST_COOKIE : PARTICIPANT_COOKIE;
        return ResponseCookie.from(name, token)
            .httpOnly(true)
            .secure(properties.session().secureCookie())
            .sameSite("Lax")
            .path("/api/rooms/" + publicRoomId)
            .maxAge(Duration.between(now, expiresAt).isNegative() ? Duration.ZERO : Duration.between(now, expiresAt))
            .build();
    }

    public ResponseCookie clear(SessionRole role, UUID publicRoomId) {
        String name = role == SessionRole.HOST ? HOST_COOKIE : PARTICIPANT_COOKIE;
        return ResponseCookie.from(name, "")
            .httpOnly(true)
            .secure(properties.session().secureCookie())
            .sameSite("Lax")
            .path("/api/rooms/" + publicRoomId)
            .maxAge(Duration.ZERO)
            .build();
    }

    public Optional<String> read(HttpServletRequest request, SessionRole role) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }
        String name = role == SessionRole.HOST ? HOST_COOKIE : PARTICIPANT_COOKIE;
        return Arrays.stream(request.getCookies())
            .filter(cookie -> name.equals(cookie.getName()))
            .map(Cookie::getValue)
            .filter(value -> !value.isBlank())
            .findFirst();
    }
}
