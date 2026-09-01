package app.ongi.sharing.security;

import java.util.Set;

import app.ongi.sharing.common.ApiException;
import app.ongi.sharing.config.OngiProperties;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class MutationGuardInterceptor implements HandlerInterceptor {

    private static final Set<String> SAFE_METHODS = Set.of("GET", "HEAD", "OPTIONS");
    private final OngiProperties properties;

    public MutationGuardInterceptor(OngiProperties properties) {
        this.properties = properties;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!request.getRequestURI().startsWith("/api/") || SAFE_METHODS.contains(request.getMethod())) {
            return true;
        }
        if (!"web".equals(request.getHeader("X-OnGi-Client"))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "CLIENT_HEADER_REQUIRED", "허용되지 않은 요청입니다.");
        }
        String origin = request.getHeader("Origin");
        if (origin != null && !properties.allowedOrigins().contains(origin)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "ORIGIN_NOT_ALLOWED", "허용되지 않은 요청입니다.");
        }
        return true;
    }
}
