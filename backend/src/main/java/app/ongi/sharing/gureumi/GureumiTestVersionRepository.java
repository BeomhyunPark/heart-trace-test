package app.ongi.sharing.gureumi;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

interface GureumiTestVersionRepository extends JpaRepository<GureumiTestVersion, UUID> {
    Optional<GureumiTestVersion> findFirstByStatusOrderByCreatedAtDesc(GureumiVersionStatus status);

    Optional<GureumiTestVersion> findByCode(String code);

    java.util.List<GureumiTestVersion> findAllByOrderByCreatedAtDesc();
}
