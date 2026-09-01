package app.ongi.sharing.session;

import java.time.Instant;
import java.util.UUID;

import app.ongi.sharing.participant.Participant;
import app.ongi.sharing.room.Room;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "room_sessions")
public class RoomSession {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SessionRole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    protected RoomSession() {}

    public RoomSession(UUID id, Room room, SessionRole role, Participant participant, String tokenHash, Instant createdAt, Instant expiresAt) {
        this.id = id;
        this.room = room;
        this.role = role;
        this.participant = participant;
        this.tokenHash = tokenHash;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public boolean isExpired(Instant now) {
        return !expiresAt.isAfter(now);
    }

    public UUID getId() { return id; }
    public Room getRoom() { return room; }
    public SessionRole getRole() { return role; }
    public Participant getParticipant() { return participant; }
    public Instant getExpiresAt() { return expiresAt; }
}
