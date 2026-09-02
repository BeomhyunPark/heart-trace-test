package app.ongi.sharing.engagement;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContentVersionRepository extends JpaRepository<ContentVersion, Long> {

    @Query("""
        select version from ContentVersion version
        join fetch version.content content
        where content.code = :contentCode
          and content.status = app.ongi.sharing.engagement.ContentStatus.PUBLISHED
          and version.publishedAt is not null
          and version.publishedAt <= :now
        order by version.publishedAt desc, version.id desc
        limit 1
        """)
    Optional<ContentVersion> findCurrentPublished(
        @Param("contentCode") String contentCode,
        @Param("now") Instant now
    );

    List<ContentVersion> findAllByContentIdOrderByPublishedAtAsc(Long contentId);
}
