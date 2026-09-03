package app.ongi.sharing.gureumi;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gureumi_test_version")
public class GureumiTestVersion {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true, length = 64)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private GureumiVersionStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected GureumiTestVersion() {}

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public GureumiVersionStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}

enum GureumiVersionStatus {
    ACTIVE,
    ARCHIVED
}
