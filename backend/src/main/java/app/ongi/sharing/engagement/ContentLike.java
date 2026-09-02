package app.ongi.sharing.engagement;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "content_like")
public class ContentLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "visitor_id", nullable = false)
    private Visitor visitor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(name = "variant_code", nullable = false, length = 80)
    private String variantCode;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected ContentLike() {}

    public ContentLike(Visitor visitor, Content content, String variantCode, Instant createdAt) {
        this.visitor = visitor;
        this.content = content;
        this.variantCode = variantCode;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Visitor getVisitor() { return visitor; }
    public Content getContent() { return content; }
    public String getVariantCode() { return variantCode; }
    public Instant getCreatedAt() { return createdAt; }
}
