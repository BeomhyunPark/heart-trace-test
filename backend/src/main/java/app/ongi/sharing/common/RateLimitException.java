package app.ongi.sharing.common;

import org.springframework.http.HttpStatus;

public class RateLimitException extends ApiException {

    private final long retryAfterSeconds;

    public RateLimitException(long retryAfterSeconds) {
        super(HttpStatus.TOO_MANY_REQUESTS, "JOIN_RATE_LIMITED", "요청이 너무 많아요. 잠시 후 다시 시도해주세요.");
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public long retryAfterSeconds() {
        return retryAfterSeconds;
    }
}
