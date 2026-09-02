package app.ongi.sharing.engagement;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContentLikeRepository extends JpaRepository<ContentLike, Long> {
    Optional<ContentLike> findByVisitorIdAndContentId(Long visitorId, Long contentId);
    boolean existsByVisitorIdAndContentId(Long visitorId, Long contentId);
    long countByContentId(Long contentId);
    long deleteByVisitorIdAndContentId(Long visitorId, Long contentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        INSERT INTO content_like (visitor_id, content_id, created_at)
        VALUES (:visitorId, :contentId, :createdAt)
        ON CONFLICT (visitor_id, content_id) DO NOTHING
        """, nativeQuery = true)
    int insertIfAbsent(
        @Param("visitorId") Long visitorId,
        @Param("contentId") Long contentId,
        @Param("createdAt") java.time.Instant createdAt
    );
}
