package app.ongi.sharing.engagement;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShareLinkRepository extends JpaRepository<ShareLink, Long> {

    @Query("select link from ShareLink link join fetch link.content where link.code = :code")
    Optional<ShareLink> findByCodeWithContent(@Param("code") String code);
}
