package app.ongi.sharing.question;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_set_id", nullable = false)
    private QuestionSet questionSet;

    @Column(nullable = false)
    private int position;

    @Column(nullable = false, length = 300)
    private String prompt;

    @Column(name = "helper_text", length = 300)
    private String helperText;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Question() {}

    public UUID getId() { return id; }
    public QuestionSet getQuestionSet() { return questionSet; }
    public int getPosition() { return position; }
    public String getPrompt() { return prompt; }
    public String getHelperText() { return helperText; }
}
