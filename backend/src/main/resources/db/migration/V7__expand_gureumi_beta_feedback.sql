ALTER TABLE gureumi_result_feedback
    ALTER COLUMN rating DROP NOT NULL,
    ADD COLUMN confusing_question_orders VARCHAR(128),
    ADD COLUMN self_selected_result_type VARCHAR(16),
    ADD COLUMN flow_rating INTEGER CHECK (flow_rating BETWEEN 1 AND 5),
    ADD COLUMN question_ui_rating INTEGER CHECK (question_ui_rating BETWEEN 1 AND 5),
    ADD COLUMN result_helpfulness_rating INTEGER CHECK (result_helpfulness_rating BETWEEN 1 AND 5),
    ADD COLUMN helpful_sections VARCHAR(256),
    ADD COLUMN result_issues VARCHAR(256),
    ADD COLUMN share_intent VARCHAR(64),
    ADD COLUMN error_areas VARCHAR(256),
    ADD COLUMN environment VARCHAR(64),
    ADD COLUMN free_comment VARCHAR(1000),
    ADD COLUMN follow_up_submitted_at TIMESTAMPTZ;

ALTER TABLE gureumi_result_feedback
    ADD CONSTRAINT chk_gureumi_feedback_rating_optional CHECK (rating IS NULL OR rating BETWEEN 1 AND 4),
    ADD CONSTRAINT chk_gureumi_feedback_self_result CHECK (
        self_selected_result_type IS NULL OR self_selected_result_type IN (
            'ARONG', 'DALMONG', 'HOOWOO', 'SUNNY',
            'CHOKCHOK', 'MONGSIL', 'ELECTRIC', 'POGEUN'
        )
    );
