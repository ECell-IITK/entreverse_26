

DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS competitions CASCADE;

-- COMPETITIONS
CREATE TABLE competitions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    slug VARCHAR(150) UNIQUE NOT NULL,

    description TEXT,

    max_team_size SMALLINT NOT NULL,

    min_team_size SMALLINT NOT NULL,

    registration_open BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TEAMS

CREATE TABLE teams (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    competition_id INTEGER NOT NULL,

    team_name VARCHAR(150) NOT NULL,

    total_members SMALLINT NOT NULL,

    comments TEXT,

    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_competition
        FOREIGN KEY (competition_id)
        REFERENCES competitions(id)
        ON DELETE CASCADE,

    CONSTRAINT valid_members
        CHECK (total_members > 0)
);

-- TEAM MEMBERS

CREATE TABLE team_members (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    team_id INTEGER NOT NULL,

    member_order SMALLINT NOT NULL,

    name VARCHAR(120) NOT NULL,

    roll_no VARCHAR(30) NOT NULL,

    email VARCHAR(150) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    is_leader BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_team
        FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE,

    CONSTRAINT valid_member_order
        CHECK (member_order >= 1),

    CONSTRAINT unique_roll_per_team
        UNIQUE (team_id, roll_no),

    CONSTRAINT unique_email_per_team
        UNIQUE (team_id, email)
);

-- INDEXES

CREATE INDEX idx_team_competition
ON teams(competition_id);

CREATE INDEX idx_member_team
ON team_members(team_id);

CREATE INDEX idx_member_roll
ON team_members(roll_no);

CREATE INDEX idx_member_email
ON team_members(email);

