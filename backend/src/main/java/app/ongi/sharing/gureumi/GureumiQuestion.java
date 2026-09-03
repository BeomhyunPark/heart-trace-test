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

@Entity
@Table(name = "gureumi_question")
public class GureumiQuestion {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "version_id", nullable = false)
    private GureumiTestVersion version;

    @Column(nullable = false, length = 8)
    private String code;

    @Column(name = "order_no", nullable = false)
    private int orderNo;

    @Column(nullable = false, length = 300)
    private String prompt;

    @Column(name = "option_a", nullable = false, length = 300)
    private String optionA;

    @Column(name = "option_b", nullable = false, length = 300)
    private String optionB;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private TraitAxis axis;

    @Enumerated(EnumType.STRING)
    @Column(name = "high_side", nullable = false, length = 1)
    private GureumiHighSide highSide;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected GureumiQuestion() {}

    public UUID getId() { return id; }
    public GureumiTestVersion getVersion() { return version; }
    public String getCode() { return code; }
    public int getOrderNo() { return orderNo; }
    public String getPrompt() { return prompt; }
    public String getOptionA() { return optionA; }
    public String getOptionB() { return optionB; }
    public TraitAxis getAxis() { return axis; }
    public GureumiHighSide getHighSide() { return highSide; }
    public boolean isActive() { return active; }
}

enum TraitAxis {
    NOVELTY,
    WORRY,
    RELATION
}

enum GureumiHighSide {
    A,
    B
}
