package app.ongi.sharing.gureumi;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

interface GureumiQuestionRepository extends JpaRepository<GureumiQuestion, UUID> {
    List<GureumiQuestion> findAllByVersion_IdAndActiveTrueOrderByOrderNo(UUID versionId);

    Optional<GureumiQuestion> findByIdAndVersion_IdAndActiveTrue(UUID id, UUID versionId);
}
