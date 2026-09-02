package app.ongi.sharing.engagement;

import java.util.List;
import java.util.Map;

import app.ongi.sharing.common.ApiException;
import org.springframework.http.HttpStatus;

final class LikeVariantPolicy {

    private static final Map<String, List<String>> VARIANTS = Map.of(
        "heart-trace", List.of("default"),
        "balance-game", List.of("light", "deep"),
        "ideal-world-cup", List.of("meal", "dessert", "late-night", "travel", "free-pass", "life-cheat"),
        "group-picker", List.of("prayer", "sharing", "lottery", "ladder", "groups", "pairs", "supporter"),
        "anonymous-sharing", List.of("default")
    );

    private LikeVariantPolicy() {}

    static String normalize(String contentCode, String requestedVariant) {
        List<String> variants = variants(contentCode);
        String variant = requestedVariant == null || requestedVariant.isBlank()
            ? variants.getFirst()
            : requestedVariant.strip();

        if (!variants.contains(variant)) {
            throw new ApiException(
                HttpStatus.BAD_REQUEST,
                "INVALID_LIKE_VARIANT",
                "이 콘텐츠에 없는 좋아요 카테고리입니다."
            );
        }
        return variant;
    }

    static List<String> variants(String contentCode) {
        List<String> variants = VARIANTS.get(contentCode);
        if (variants == null) {
            throw new ApiException(
                HttpStatus.NOT_FOUND,
                "CONTENT_NOT_AVAILABLE",
                "현재 공개된 콘텐츠가 아닙니다."
            );
        }
        return variants;
    }
}
