package app.ongi.sharing.gureumi;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import app.ongi.sharing.common.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
class GureumiAdminAccess {

    private final byte[] configuredKey;

    GureumiAdminAccess(@Value("${ongi.gureumi.admin-key:}") String configuredKey) {
        this.configuredKey = configuredKey.getBytes(StandardCharsets.UTF_8);
    }

    void require(String providedKey) {
        if (configuredKey.length == 0) {
            throw new ApiException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "GUREUMI_ADMIN_DISABLED",
                "구르미 Beta 통계 접근 키가 서버에 설정되지 않았습니다."
            );
        }
        byte[] provided = providedKey == null
            ? new byte[0]
            : providedKey.getBytes(StandardCharsets.UTF_8);
        if (!MessageDigest.isEqual(configuredKey, provided)) {
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                "GUREUMI_ADMIN_UNAUTHORIZED",
                "통계 접근 키를 확인해주세요."
            );
        }
    }
}
