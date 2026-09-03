package app.ongi.sharing.gureumi;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(name = "gureumi_attempt")
public class GureumiAttempt {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "version_id", nullable = false)
    private GureumiTestVersion testVersion;

    @Column(name = "resume_token_hash", nullable = false, unique = true, length = 64)
    private String resumeTokenHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "previous_attempt_id", unique = true)
    private GureumiAttempt previousAttempt;

    @Column(name = "attempt_no", nullable = false)
    private int attemptNo;

    @Column(name = "is_first_attempt", nullable = false)
    private boolean firstAttempt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private GureumiAttemptStatus status;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "result_type", length = 16)
    private GureumiResultType resultType;

    @Column(name = "novelty_score")
    private Integer noveltyScore;

    @Column(name = "worry_score")
    private Integer worryScore;

    @Column(name = "relation_score")
    private Integer relationScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "novelty_level", length = 8)
    private TraitLevel noveltyLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "worry_level", length = 8)
    private TraitLevel worryLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "relation_level", length = 8)
    private TraitLevel relationLevel;

    @Column(name = "novelty_boundary")
    private Boolean noveltyBoundary;

    @Column(name = "worry_boundary")
    private Boolean worryBoundary;

    @Column(name = "relation_boundary")
    private Boolean relationBoundary;

    @Version
    @Column(name = "row_version", nullable = false)
    private long rowVersion;

    protected GureumiAttempt() {}

    public GureumiAttempt(
        UUID id,
        GureumiTestVersion testVersion,
        String resumeTokenHash,
        GureumiAttempt previousAttempt,
        int attemptNo,
        Instant startedAt
    ) {
        this.id = id;
        this.testVersion = testVersion;
        this.resumeTokenHash = resumeTokenHash;
        this.previousAttempt = previousAttempt;
        this.attemptNo = attemptNo;
        this.firstAttempt = attemptNo == 1;
        this.status = GureumiAttemptStatus.IN_PROGRESS;
        this.startedAt = startedAt;
    }

    public void complete(
        GureumiScoring.AxisResult novelty,
        GureumiScoring.AxisResult worry,
        GureumiScoring.AxisResult relation,
        GureumiResultType resultType,
        Instant completedAt
    ) {
        this.noveltyScore = novelty.score();
        this.worryScore = worry.score();
        this.relationScore = relation.score();
        this.noveltyLevel = novelty.level();
        this.worryLevel = worry.level();
        this.relationLevel = relation.level();
        this.noveltyBoundary = novelty.nearBoundary();
        this.worryBoundary = worry.nearBoundary();
        this.relationBoundary = relation.nearBoundary();
        this.resultType = resultType;
        this.completedAt = completedAt;
        this.status = GureumiAttemptStatus.COMPLETED;
    }

    public UUID getId() { return id; }
    public GureumiTestVersion getTestVersion() { return testVersion; }
    public String getResumeTokenHash() { return resumeTokenHash; }
    public int getAttemptNo() { return attemptNo; }
    public boolean isFirstAttempt() { return firstAttempt; }
    public GureumiAttemptStatus getStatus() { return status; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public GureumiResultType getResultType() { return resultType; }
    public TraitLevel getNoveltyLevel() { return noveltyLevel; }
    public TraitLevel getWorryLevel() { return worryLevel; }
    public TraitLevel getRelationLevel() { return relationLevel; }
    public boolean isCompleted() { return status == GureumiAttemptStatus.COMPLETED; }
}

enum GureumiAttemptStatus {
    IN_PROGRESS,
    COMPLETED
}

enum TraitLevel {
    LOW,
    HIGH
}

enum GureumiResultType {
    ARONG("arong", "아롱이"),
    DALMONG("dalmong", "달몽이"),
    HOOWOO("hoowoo", "후우"),
    SUNNY("sunny", "쨍이"),
    CHOKCHOK("chokchok", "촉촉이"),
    MONGSIL("mongsil", "몽실이"),
    ELECTRIC("electric", "찌릿이"),
    POGEUN("pogeun", "포근이");

    private final String characterKey;
    private final String displayName;

    GureumiResultType(String characterKey, String displayName) {
        this.characterKey = characterKey;
        this.displayName = displayName;
    }

    public String characterKey() { return characterKey; }
    public String displayName() { return displayName; }
}
