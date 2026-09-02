ALTER TABLE content_like
    ADD COLUMN variant_code VARCHAR(80) NOT NULL DEFAULT 'default';

UPDATE content_like content_like
SET variant_code = CASE content.code
    WHEN 'balance-game' THEN 'light'
    WHEN 'ideal-world-cup' THEN 'meal'
    WHEN 'group-picker' THEN 'prayer'
    ELSE 'default'
END
FROM content
WHERE content.id = content_like.content_id;

ALTER TABLE content_like
    DROP CONSTRAINT content_like_visitor_id_content_id_key;

ALTER TABLE content_like
    ADD CONSTRAINT uq_content_like_visitor_content_variant
    UNIQUE (visitor_id, content_id, variant_code);

DROP INDEX idx_content_like_content;

CREATE INDEX idx_content_like_content_variant
    ON content_like(content_id, variant_code);
