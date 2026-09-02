package app.ongi.sharing.engagement;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentRepository extends JpaRepository<Content, Long> {
    Optional<Content> findByCode(String code);
    Optional<Content> findByCodeAndStatus(String code, ContentStatus status);
}
