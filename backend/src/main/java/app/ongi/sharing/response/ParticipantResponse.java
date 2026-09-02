package app.ongi.sharing.response;

import java.time.Instant;
import java.util.UUID;

import app.ongi.sharing.participant.Participant;
import app.ongi.sharing.question.Question;
import app.ongi.sharing.question.QuestionSet;
import app.ongi.sharing.room.Room;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "responses")
public class ParticipantResponse {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_set_id", nullable = false)
    private QuestionSet questionSet;

    @Column(nullable = false, columnDefinition = "text")
    private String answer;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected ParticipantResponse() {}

    public ParticipantResponse(UUID id, Room room, Participant participant, Question question, String answer, Instant now) {
        this.id = id;
        this.room = room;
        this.participant = participant;
        this.question = question;
        this.questionSet = question.getQuestionSet();
        this.answer = answer;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void updateAnswer(String answer, Instant now) {
        this.answer = answer;
        this.updatedAt = now;
    }

    public UUID getId() { return id; }
    public Room getRoom() { return room; }
    public Participant getParticipant() { return participant; }
    public Question getQuestion() { return question; }
    public String getAnswer() { return answer; }
    public Instant getUpdatedAt() { return updatedAt; }
}
