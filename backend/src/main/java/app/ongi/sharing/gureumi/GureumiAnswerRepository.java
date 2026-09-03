package app.ongi.sharing.gureumi;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

interface GureumiAnswerRepository extends JpaRepository<GureumiAnswer, UUID> {
    Optional<GureumiAnswer> findByAttempt_IdAndQuestion_Id(UUID attemptId, UUID questionId);

    List<GureumiAnswer> findAllByAttempt_IdOrderByQuestion_OrderNo(UUID attemptId);
}
