CREATE TABLE question_sets (
    id UUID PRIMARY KEY,
    slug VARCHAR(80) NOT NULL UNIQUE,
    title VARCHAR(120) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE questions (
    id UUID PRIMARY KEY,
    question_set_id UUID NOT NULL REFERENCES question_sets(id),
    position INTEGER NOT NULL CHECK (position > 0),
    prompt VARCHAR(300) NOT NULL,
    helper_text VARCHAR(300),
    created_at TIMESTAMPTZ NOT NULL,
    UNIQUE (question_set_id, position),
    UNIQUE (id, question_set_id)
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    code VARCHAR(8) NOT NULL UNIQUE,
    title VARCHAR(120) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('CREATED', 'WRITING', 'LOCKED', 'SHARING', 'COMPLETED')),
    question_set_id UUID NOT NULL REFERENCES question_sets(id),
    current_round INTEGER NOT NULL DEFAULT 0 CHECK (current_round >= 0),
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    UNIQUE (id, question_set_id)
);

CREATE INDEX idx_rooms_expiry ON rooms(status, expires_at);

CREATE TABLE participants (
    id UUID PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    name VARCHAR(40) NOT NULL,
    normalized_name VARCHAR(80) NOT NULL,
    response_completed BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMPTZ NOT NULL,
    UNIQUE (room_id, normalized_name),
    UNIQUE (id, room_id)
);

CREATE INDEX idx_participants_room ON participants(room_id);

CREATE TABLE room_sessions (
    id UUID PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('HOST', 'PARTICIPANT')),
    participant_id UUID REFERENCES participants(id) ON DELETE SET NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_room_sessions_room ON room_sessions(room_id);
CREATE INDEX idx_room_sessions_expiry ON room_sessions(expires_at);

CREATE TABLE responses (
    id UUID PRIMARY KEY,
    room_id UUID NOT NULL,
    participant_id UUID NOT NULL,
    question_id UUID NOT NULL,
    question_set_id UUID NOT NULL,
    answer TEXT NOT NULL CHECK (char_length(answer) <= 2000),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (room_id, question_set_id) REFERENCES rooms(id, question_set_id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id, room_id) REFERENCES participants(id, room_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id, question_set_id) REFERENCES questions(id, question_set_id),
    UNIQUE (participant_id, question_id)
);

CREATE INDEX idx_responses_room_participant ON responses(room_id, participant_id);

CREATE TABLE sharing_rounds (
    id UUID PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL,
    sequence INTEGER NOT NULL CHECK (sequence >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('ANONYMOUS', 'REVEALED', 'COMPLETED')),
    created_at TIMESTAMPTZ NOT NULL,
    revealed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    FOREIGN KEY (participant_id, room_id) REFERENCES participants(id, room_id) ON DELETE CASCADE,
    UNIQUE (room_id, sequence),
    UNIQUE (room_id, participant_id)
);

CREATE INDEX idx_sharing_rounds_current ON sharing_rounds(room_id, sequence, status);
