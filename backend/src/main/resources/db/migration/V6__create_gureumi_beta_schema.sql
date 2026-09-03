CREATE TABLE gureumi_test_version (
    id UUID PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    status VARCHAR(16) NOT NULL CHECK (status IN ('ACTIVE', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX uq_gureumi_single_active_version
    ON gureumi_test_version(status)
    WHERE status = 'ACTIVE';

CREATE TABLE gureumi_question (
    id UUID PRIMARY KEY,
    version_id UUID NOT NULL REFERENCES gureumi_test_version(id),
    code VARCHAR(8) NOT NULL,
    order_no INTEGER NOT NULL CHECK (order_no BETWEEN 1 AND 999),
    prompt VARCHAR(300) NOT NULL,
    option_a VARCHAR(300) NOT NULL,
    option_b VARCHAR(300) NOT NULL,
    axis VARCHAR(16) NOT NULL CHECK (axis IN ('NOVELTY', 'WORRY', 'RELATION')),
    high_side CHAR(1) NOT NULL CHECK (high_side IN ('A', 'B')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    UNIQUE (version_id, code),
    UNIQUE (version_id, order_no),
    UNIQUE (id, version_id)
);

CREATE INDEX idx_gureumi_question_version_order
    ON gureumi_question(version_id, order_no)
    WHERE active = TRUE;

CREATE TABLE gureumi_attempt (
    id UUID PRIMARY KEY,
    version_id UUID NOT NULL REFERENCES gureumi_test_version(id),
    resume_token_hash VARCHAR(64) NOT NULL UNIQUE,
    previous_attempt_id UUID UNIQUE REFERENCES gureumi_attempt(id),
    attempt_no INTEGER NOT NULL CHECK (attempt_no > 0),
    is_first_attempt BOOLEAN NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('IN_PROGRESS', 'COMPLETED')),
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    result_type VARCHAR(16) CHECK (result_type IN (
        'ARONG', 'DALMONG', 'HOOWOO', 'SUNNY',
        'CHOKCHOK', 'MONGSIL', 'ELECTRIC', 'POGEUN'
    )),
    novelty_score INTEGER CHECK (novelty_score BETWEEN 9 AND 36),
    worry_score INTEGER CHECK (worry_score BETWEEN 9 AND 36),
    relation_score INTEGER CHECK (relation_score BETWEEN 9 AND 36),
    novelty_level VARCHAR(8) CHECK (novelty_level IN ('LOW', 'HIGH')),
    worry_level VARCHAR(8) CHECK (worry_level IN ('LOW', 'HIGH')),
    relation_level VARCHAR(8) CHECK (relation_level IN ('LOW', 'HIGH')),
    novelty_boundary BOOLEAN,
    worry_boundary BOOLEAN,
    relation_boundary BOOLEAN,
    row_version BIGINT NOT NULL DEFAULT 0,
    UNIQUE (id, version_id),
    CHECK ((attempt_no = 1 AND is_first_attempt) OR (attempt_no > 1 AND NOT is_first_attempt)),
    CHECK (
        (status = 'IN_PROGRESS'
            AND completed_at IS NULL
            AND result_type IS NULL
            AND novelty_score IS NULL
            AND worry_score IS NULL
            AND relation_score IS NULL
            AND novelty_level IS NULL
            AND worry_level IS NULL
            AND relation_level IS NULL
            AND novelty_boundary IS NULL
            AND worry_boundary IS NULL
            AND relation_boundary IS NULL)
        OR
        (status = 'COMPLETED'
            AND completed_at IS NOT NULL
            AND result_type IS NOT NULL
            AND novelty_score IS NOT NULL
            AND worry_score IS NOT NULL
            AND relation_score IS NOT NULL
            AND novelty_level IS NOT NULL
            AND worry_level IS NOT NULL
            AND relation_level IS NOT NULL
            AND novelty_boundary IS NOT NULL
            AND worry_boundary IS NOT NULL
            AND relation_boundary IS NOT NULL)
    )
);

CREATE INDEX idx_gureumi_attempt_version_started
    ON gureumi_attempt(version_id, started_at);
CREATE INDEX idx_gureumi_attempt_completed_first
    ON gureumi_attempt(version_id, result_type)
    WHERE status = 'COMPLETED' AND is_first_attempt = TRUE;

CREATE TABLE gureumi_answer (
    id UUID PRIMARY KEY,
    attempt_id UUID NOT NULL,
    question_id UUID NOT NULL,
    version_id UUID NOT NULL,
    choice VARCHAR(16) NOT NULL CHECK (choice IN ('A_VERY', 'A_LITTLE', 'B_LITTLE', 'B_VERY')),
    score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 4),
    response_ms INTEGER CHECK (response_ms BETWEEN 0 AND 3600000),
    answered_at TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (attempt_id, version_id) REFERENCES gureumi_attempt(id, version_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id, version_id) REFERENCES gureumi_question(id, version_id),
    UNIQUE (attempt_id, question_id)
);

CREATE INDEX idx_gureumi_answer_attempt ON gureumi_answer(attempt_id);
CREATE INDEX idx_gureumi_answer_question ON gureumi_answer(question_id);

CREATE TABLE gureumi_result_feedback (
    id UUID PRIMARY KEY,
    attempt_id UUID NOT NULL UNIQUE REFERENCES gureumi_attempt(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 4),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

INSERT INTO gureumi_test_version (id, code, status, created_at)
VALUES ('30000000-0000-0000-0000-000000000001', 'GUREUMI_BETA_V01', 'ACTIVE', CURRENT_TIMESTAMP);

INSERT INTO gureumi_question (
    id, version_id, code, order_no, prompt, option_a, option_b, axis, high_side, active, created_at
) VALUES
('31000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'N01', 1, '모처럼 시간이 비었다면', '평소 안 해본 걸 찾아보고 싶다.', '원래 좋아하던 걸 하며 보내고 싶다.', 'NOVELTY', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'R03', 2, '중요한 선택을 할 때', '내가 납득되는지가 가장 중요하다.', '가까운 사람들이 어떻게 느낄지도 중요하다.', 'RELATION', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 'W01', 3, '중요한 일정의 세부사항이 아직 정해지지 않았다.', '어느 정도 미리 알아야 마음이 놓인다.', '정해지면 그때 맞추면 된다고 생각한다.', 'WORRY', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 'N03', 4, '지금 잘 쓰고 있는 방법 외에 다른 방법을 알게 됐다.', '지금 방식이 괜찮다면 그대로 쓴다.', '괜찮아 보이면 한번 직접 써본다.', 'NOVELTY', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', 'W04', 5, '필요한 정보가 전부 모이지 않은 상태에서 선택해야 한다.', '가능하면 조금 더 확인하고 결정하고 싶다.', '어느 정도 알았다면 결정할 수 있다.', 'WORRY', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', 'R01', 6, '고민이 생겼을 때', '혼자 생각하면서 답을 찾는 편이다.', '믿는 사람과 이야기하면서 답을 찾는 편이다.', 'RELATION', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000001', 'W07', 7, '계획대로 안 될 가능성이 조금 있다.', '미리 다른 방법 하나쯤 생각해두면 편하다.', '문제가 생기면 그때 대응해도 된다고 생각한다.', 'WORRY', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000001', 'N06', 8, '가볼 만한 곳을 고른다면', '이미 알고 좋아하는 곳에 다시 가도 좋다.', '아직 안 가본 곳에 더 마음이 간다.', 'NOVELTY', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000001', 'R05', 9, '가까운 사람의 말투나 분위기가 평소와 조금 다르다.', '무슨 일이 있는 건지 자연스럽게 신경이 쓰인다.', '특별한 일이 없다면 크게 의미를 두지 않는다.', 'RELATION', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000001', 'N04', 10, '비슷한 일상이 한동안 이어지면', '익숙한 흐름이 생겨 편안하다.', '슬슬 뭔가 달라졌으면 좋겠다는 생각이 든다.', 'NOVELTY', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000001', 'W02', 11, '결과를 아직 알 수 없는 일이 하나 있다.', '결과가 나올 때까지 종종 생각나는 편이다.', '지금 할 수 있는 게 없다면 다른 일에 집중한다.', 'WORRY', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000001', 'R08', 12, '내 마음이 어떤지 나도 잘 모르겠다.', '혼자 생각하다 보면 점점 분명해진다.', '누군가에게 말하다 보면 점점 분명해진다.', 'RELATION', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000001', 'W05', 13, '당장 문제는 없지만 뭔가 평소와 다른 점을 발견했다.', '혹시 이유가 있는지 확인해보고 싶다.', '특별한 일이 없다면 일단 지켜본다.', 'WORRY', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000001', 'N02', 14, '자주 가는 식당에서 메뉴를 고른다면', '만족했던 메뉴에 다시 손이 간다.', '처음 보는 메뉴가 더 궁금해진다.', 'NOVELTY', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000001', 'R06', 15, '내가 공들인 일이 잘 끝났다.', '소중한 사람의 좋은 반응까지 있으면 더 기쁘다.', '내 기준에서 만족스러우면 그것으로 충분하다.', 'RELATION', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000016', '30000000-0000-0000-0000-000000000001', 'N07', 16, '선택지가 여러 개 있는데 하나는 익숙하고 하나는 처음 보는 것이다.', '익숙한 쪽에 자연스럽게 손이 간다.', '처음 보는 쪽이 자연스럽게 궁금해진다.', 'NOVELTY', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000017', '30000000-0000-0000-0000-000000000001', 'W09', 17, '중요한 선택을 끝낸 뒤', '혹시 놓친 게 없었는지 다시 생각해보는 편이다.', '결정했으면 다음으로 넘어가는 편이다.', 'WORRY', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000018', '30000000-0000-0000-0000-000000000001', 'R04', 18, '마음이 복잡한 일이 있었을 때', '혼자 시간을 가지면 정리가 된다.', '믿는 사람과 이야기하면 정리가 된다.', 'RELATION', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000019', '30000000-0000-0000-0000-000000000001', 'W03', 19, '예정된 계획이 갑자기 바뀌었다.', '무엇이 달라졌는지부터 확인하고 싶다.', '우선 바뀐 상황에 맞춰본다.', 'WORRY', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000020', '30000000-0000-0000-0000-000000000001', 'N08', 20, '마음에 드는 취미를 찾았다면', '하나를 오래 즐기는 편이 좋다.', '중간중간 새로운 것도 경험해보고 싶다.', 'NOVELTY', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000021', '30000000-0000-0000-0000-000000000001', 'R07', 21, '가까운 사람과 의견이 다르다.', '생각의 차이가 서로의 마음에 어떤 영향을 주는지도 신경 쓰인다.', '서로 생각이 다른 것과 관계는 별개라고 느낀다.', 'RELATION', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000022', '30000000-0000-0000-0000-000000000001', 'W08', 22, '“혹시 이런 문제가 생기면?”이라는 생각이 떠올랐다.', '실제 징후가 없다면 크게 신경 쓰지 않는다.', '가능성이 작아도 어떻게 대응할지 한번 생각해본다.', 'WORRY', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000023', '30000000-0000-0000-0000-000000000001', 'N05', 23, '볼거리나 읽을거리를 고를 때', '평소 접하지 않던 종류도 궁금하다.', '원래 좋아하는 종류를 고르는 편이다.', 'NOVELTY', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000024', '30000000-0000-0000-0000-000000000001', 'R02', 24, '정말 좋은 일이 생겼을 때', '혼자 충분히 즐겨도 만족스럽다.', '누군가에게 이야기하고 함께 좋아하고 싶어진다.', 'RELATION', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000025', '30000000-0000-0000-0000-000000000001', 'W06', 25, '중요한 약속이나 일정이 있다.', '예상 밖의 일을 생각해 조금 여유 있게 움직이는 편이다.', '필요한 시간에 맞춰 움직이는 편이다.', 'WORRY', 'A', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000026', '30000000-0000-0000-0000-000000000001', 'N09', 26, '하루를 자유롭게 구성할 수 있다면', '내가 좋아하는 익숙한 방식대로 보내고 싶다.', '평소와 다른 것을 하나쯤 넣고 싶다.', 'NOVELTY', 'B', TRUE, CURRENT_TIMESTAMP),
('31000000-0000-0000-0000-000000000027', '30000000-0000-0000-0000-000000000001', 'R09', 27, '힘든 일이 지나간 뒤', '믿는 사람과 연결되어 있다는 느낌이 회복에 도움이 된다.', '혼자 쉬고 정리하면서 회복하는 편이다.', 'RELATION', 'A', TRUE, CURRENT_TIMESTAMP);
