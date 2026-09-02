package app.ongi.sharing.engagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContentLikeRepository extends JpaRepository<ContentLike, Long> {
    boolean existsByVisitorIdAndContentIdAndVariantCode(Long visitorId, Long contentId, String variantCode);
    long countByContentId(Long contentId);
    long countByContentIdAndVariantCode(Long contentId, String variantCode);
    long deleteByVisitorIdAndContentIdAndVariantCode(Long visitorId, Long contentId, String variantCode);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        INSERT INTO content_like (visitor_id, content_id, variant_code, created_at)
        VALUES (:visitorId, :contentId, :variantCode, :createdAt)
        ON CONFLICT (visitor_id, content_id, variant_code) DO NOTHING
        """, nativeQuery = true)
    int insertIfAbsent(
        @Param("visitorId") Long visitorId,
        @Param("contentId") Long contentId,
        @Param("variantCode") String variantCode,
        @Param("createdAt") java.time.Instant createdAt
    );
}
