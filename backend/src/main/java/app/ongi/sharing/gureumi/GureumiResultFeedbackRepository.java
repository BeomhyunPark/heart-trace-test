package app.ongi.sharing.gureumi;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

interface GureumiResultFeedbackRepository extends JpaRepository<GureumiResultFeedback, UUID> {
    Optional<GureumiResultFeedback> findByAttempt_Id(UUID attemptId);
}
