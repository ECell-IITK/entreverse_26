-- EntreVerse 2026 — database schema
-- Applied automatically when the postgres container is first created.
-- To reset: docker compose down -v && docker compose up

DROP TABLE IF EXISTS team_members  CASCADE;
DROP TABLE IF EXISTS teams         CASCADE;
DROP TABLE IF EXISTS competitions  CASCADE;
DROP TABLE IF EXISTS events        CASCADE;

-- ── EVENTS ───────────────────────────────────────────────────
-- An event is a top-level programme (e.g. "EntreVerse 2026").
-- It owns one or more competitions.

CREATE TABLE events (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    slug        VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_slug ON events(slug);

-- ── COMPETITIONS ─────────────────────────────────────────────

CREATE TABLE competitions (
    id                INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id          INTEGER NOT NULL,
    name              VARCHAR(150) NOT NULL,
    slug              VARCHAR(150) UNIQUE NOT NULL,
    description       TEXT,
    max_team_size     SMALLINT NOT NULL,
    min_team_size     SMALLINT NOT NULL,
    registration_open BOOLEAN NOT NULL DEFAULT TRUE,
    -- Per-competition registration secret supplied by participants at sign-up.
    -- Store plain text for local dev; use bcrypt hashes in production.
    registration_code VARCHAR(255) NOT NULL DEFAULT '',
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event
        FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_competitions_slug     ON competitions(slug);
CREATE INDEX idx_competitions_event    ON competitions(event_id);

-- ── TEAMS ────────────────────────────────────────────────────

CREATE TABLE teams (
    id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    competition_id INTEGER NOT NULL,
    team_name      VARCHAR(150) NOT NULL,
    total_members  SMALLINT NOT NULL,
    comments       TEXT,
    submitted_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_competition
        FOREIGN KEY (competition_id) REFERENCES competitions(id)
        ON DELETE CASCADE,

    CONSTRAINT valid_members
        CHECK (total_members > 0),

    CONSTRAINT unique_team_name_per_competition
        UNIQUE (competition_id, team_name)
);

CREATE INDEX idx_team_competition ON teams(competition_id);

-- ── TEAM MEMBERS ─────────────────────────────────────────────

CREATE TABLE team_members (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_id      INTEGER NOT NULL,
    member_order SMALLINT NOT NULL,
    name         VARCHAR(120) NOT NULL,
    roll_no      VARCHAR(30) NOT NULL,
    email        VARCHAR(150) NOT NULL,
    phone        VARCHAR(20) NOT NULL,
    is_leader    BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_team
        FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE CASCADE,

    CONSTRAINT valid_member_order
        CHECK (member_order >= 1),

    CONSTRAINT unique_roll_per_team
        UNIQUE (team_id, roll_no),

    CONSTRAINT unique_email_per_team
        UNIQUE (team_id, email)
);

CREATE INDEX idx_member_team  ON team_members(team_id);
CREATE INDEX idx_member_roll  ON team_members(roll_no);
CREATE INDEX idx_member_email ON team_members(email);

-- ── SEED DATA ────────────────────────────────────────────────

INSERT INTO events (name, slug, description) VALUES
(
    'EntreVerse 2026',
    'entreverse-2026',
    'E-Cell IITK''s flagship entrepreneurship fest featuring competitions, talks, and workshops.'
);

-- competitions belong to the single seeded event (id = 1)
INSERT INTO competitions (event_id, name, slug, description, max_team_size, min_team_size, registration_code) VALUES
(1, 'Flip the Future',     'flip-the-future',   'A strategic investment and auction challenge where teams build portfolios under pressure.', 4, 2, 'FTF-2026-SECRET'),
(1, 'The Strategy Showdown','strategy-showdown', 'A business innovation challenge testing real-world problem-solving and strategic thinking.', 4, 2, 'TSS-2026-SECRET'),
(1, 'Start-up Sprint',     'startup-sprint',    'A 24-hour hackathon where teams build and pitch a working MVP from scratch.',              5, 1, 'SUS-2026-SECRET');
