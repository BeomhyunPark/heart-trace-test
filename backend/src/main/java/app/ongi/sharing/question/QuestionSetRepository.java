package app.ongi.sharing.question;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionSetRepository extends JpaRepository<QuestionSet, UUID> {
    Optional<QuestionSet> findBySlugAndActiveTrue(String slug);
}
