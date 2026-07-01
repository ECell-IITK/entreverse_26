package database

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"entreverse/backend/model"

	"github.com/jackc/pgx/v5"
)

// Sentinel errors 

var (
	ErrNotFound       = errors.New("not found")
	ErrDuplicateTeam  = errors.New("team name already registered for this competition")
	ErrDuplicateRoll  = errors.New("a roll number in your team is already registered for this competition")
	ErrDuplicateEmail = errors.New("an email address in your team is already registered for this competition")
	ErrDuplicateSlug  = errors.New("a competition with that slug already exists")
)

//  Competition queries 

// GetCompetitions returns all competitions, optionally filtered to open-only.
func GetCompetitions(openOnly bool) ([]model.Competition, error) {
	ctx := context.Background()

	q := "SELECT id, event_id, name, slug, description, max_team_size, min_team_size, registration_open, created_at FROM competitions"
	if openOnly {
		q += " WHERE registration_open = TRUE"
	}
	q += " ORDER BY id ASC"

	rows, err := DB.Query(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("query competitions: %w", err)
	}
	defer rows.Close()

	var out []model.Competition
	for rows.Next() {
		var c model.Competition
		if err := rows.Scan(
			&c.ID, &c.EventID, &c.Name, &c.Slug, &c.Description,
			&c.MaxTeamSize, &c.MinTeamSize, &c.RegistrationOpen, &c.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan competition: %w", err)
		}
		out = append(out, c)
	}
	return out, rows.Err()
}

// getCompetitionRowByID returns the full internal row (including registration_code).
func getCompetitionRowByID(ctx context.Context, id int) (*model.CompetitionRow, error) {
	var r model.CompetitionRow
	err := DB.QueryRow(ctx,
		`SELECT id, event_id, name, slug, description,
		        max_team_size, min_team_size, registration_open, created_at,
		        registration_code
		 FROM competitions WHERE id = $1`, id,
	).Scan(
		&r.ID, &r.EventID, &r.Name, &r.Slug, &r.Description,
		&r.MaxTeamSize, &r.MinTeamSize, &r.RegistrationOpen, &r.CreatedAt,
		&r.RegistrationCode,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get competition %d: %w", id, err)
	}
	return &r, nil
}

// GetCompetitionByID returns the public Competition (no code) or ErrNotFound.
func GetCompetitionByID(id int) (*model.Competition, error) {
	row, err := getCompetitionRowByID(context.Background(), id)
	if err != nil {
		return nil, err
	}
	return &row.Competition, nil
}

// GetCompetitionRowByID exposes the internal row to handlers that need the code.
func GetCompetitionRowByID(id int) (*model.CompetitionRow, error) {
	return getCompetitionRowByID(context.Background(), id)
}

// GetCompetitionBySlug returns the public Competition looked up by slug.
func GetCompetitionBySlug(slug string) (*model.Competition, error) {
	ctx := context.Background()
	var c model.Competition
	err := DB.QueryRow(ctx,
		`SELECT id, event_id, name, slug, description,
		        max_team_size, min_team_size, registration_open, created_at
		 FROM competitions WHERE slug = $1`, slug,
	).Scan(
		&c.ID, &c.EventID, &c.Name, &c.Slug, &c.Description,
		&c.MaxTeamSize, &c.MinTeamSize, &c.RegistrationOpen, &c.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get competition by slug %q: %w", slug, err)
	}
	return &c, nil
}


func checkDuplicates(ctx context.Context, tx pgx.Tx, competitionID int, members []model.Member) error {
	for _, m := range members {
		var exists bool

		if err := tx.QueryRow(ctx, `
			SELECT EXISTS (
				SELECT 1 FROM team_members tm
				JOIN teams t ON t.id = tm.team_id
				WHERE t.competition_id = $1 AND tm.roll_no = $2
			)`, competitionID, m.RollNo,
		).Scan(&exists); err != nil {
			return fmt.Errorf("check dup roll: %w", err)
		}
		if exists {
			return ErrDuplicateRoll
		}

		if err := tx.QueryRow(ctx, `
			SELECT EXISTS (
				SELECT 1 FROM team_members tm
				JOIN teams t ON t.id = tm.team_id
				WHERE t.competition_id = $1 AND tm.email = $2
			)`, competitionID, m.Email,
		).Scan(&exists); err != nil {
			return fmt.Errorf("check dup email: %w", err)
		}
		if exists {
			return ErrDuplicateEmail
		}
	}
	return nil
}

// RegisterTeam 

// RegisterTeam inserts a team and its members in a single transaction.
func RegisterTeam(req model.RegisterRequest) (int, error) {
	ctx := context.Background()

	tx, err := DB.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return 0, fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	if err := checkDuplicates(ctx, tx, req.CompetitionID, req.Members); err != nil {
		return 0, err
	}

	var teamID int
	err = tx.QueryRow(ctx,
		`INSERT INTO teams (competition_id, team_name, total_members, comments)
		 VALUES ($1, $2, $3, $4) RETURNING id`,
		req.CompetitionID, req.TeamName, len(req.Members), req.Comments,
	).Scan(&teamID)
	if err != nil {
		if isDuplicateKeyError(err) {
			return 0, ErrDuplicateTeam
		}
		return 0, fmt.Errorf("insert team: %w", err)
	}

	for i, m := range req.Members {
		if _, err = tx.Exec(ctx,
			`INSERT INTO team_members
			 (team_id, member_order, name, roll_no, email, phone, is_leader)
			 VALUES ($1,$2,$3,$4,$5,$6,$7)`,
			teamID, i+1, m.Name, m.RollNo, m.Email, m.Phone, m.IsLeader,
		); err != nil {
			return 0, fmt.Errorf("insert member %d: %w", i+1, err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return 0, fmt.Errorf("commit: %w", err)
	}
	return teamID, nil
}

//  Registration detail lookup

// GetRegistrationByTeamID returns full team + member details.
func GetRegistrationByTeamID(teamID int) (*model.RegistrationDetail, error) {
	ctx := context.Background()

	var d model.RegistrationDetail
	err := DB.QueryRow(ctx, `
		SELECT t.id, t.team_name,
		       c.name, c.slug,
		       e.name,
		       t.total_members, COALESCE(t.comments, ''), t.submitted_at
		FROM teams t
		JOIN competitions c ON c.id = t.competition_id
		JOIN events       e ON e.id = c.event_id
		WHERE t.id = $1`, teamID,
	).Scan(
		&d.TeamID, &d.TeamName,
		&d.Competition, &d.CompSlug,
		&d.EventName,
		&d.TotalMembers, &d.Comments, &d.SubmittedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get team %d: %w", teamID, err)
	}

	rows, err := DB.Query(ctx, `
		SELECT name, roll_no, email, phone, is_leader
		FROM team_members
		WHERE team_id = $1
		ORDER BY member_order ASC`, teamID,
	)
	if err != nil {
		return nil, fmt.Errorf("get members team %d: %w", teamID, err)
	}
	defer rows.Close()

	for rows.Next() {
		var m model.Member
		if err := rows.Scan(&m.Name, &m.RollNo, &m.Email, &m.Phone, &m.IsLeader); err != nil {
			return nil, fmt.Errorf("scan member: %w", err)
		}
		d.Members = append(d.Members, m)
	}
	return &d, rows.Err()
}


func isDuplicateKeyError(err error) bool {
	return err != nil && strings.Contains(err.Error(), "23505")
}
