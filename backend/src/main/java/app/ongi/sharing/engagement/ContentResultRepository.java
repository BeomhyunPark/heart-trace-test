package app.ongi.sharing.engagement;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentResultRepository extends JpaRepository<ContentResult, Long> {
    Optional<ContentResult> findByVersionIdAndCodeAndActiveTrue(Long versionId, String code);
    List<ContentResult> findAllByVersionIdAndActiveTrueOrderBySortOrder(Long versionId);
    long countByVersionIdAndActiveTrue(Long versionId);
}
