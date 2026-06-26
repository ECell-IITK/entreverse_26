package database

import (
	"context"
	"fmt"

	"entreverse/backend/model"

	"github.com/jackc/pgx/v5"
)

// RegisterTeam inserts a team and all its members in a single transaction.
// Returns the newly created team ID on success.
func RegisterTeam(req model.RegisterRequest) (int, error) {

	ctx := context.Background()

	tx, err := DB.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return 0, fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx) // no-op after Commit

	// ── 1. Insert team ───────────────────────────────────────
	var teamID int

	err = tx.QueryRow(
		ctx,
		`INSERT INTO teams
			(competition_id, team_name, total_members, comments)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id`,
		req.CompetitionID,
		req.TeamName,
		len(req.Members),
		req.Comments,
	).Scan(&teamID)

	if err != nil {
		return 0, fmt.Errorf("insert team: %w", err)
	}

	// ── 2. Insert members ────────────────────────────────────
	for i, member := range req.Members {
		_, err = tx.Exec(
			ctx,
			`INSERT INTO team_members
				(team_id, member_order, name, roll_no, email, phone, is_leader)
			 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			teamID,
			i+1,
			member.Name,
			member.RollNo,
			member.Email,
			member.Phone,
			member.IsLeader,
		)
		if err != nil {
			return 0, fmt.Errorf("insert member %d: %w", i+1, err)
		}
	}

	// ── 3. Commit ────────────────────────────────────────────
	if err := tx.Commit(ctx); err != nil {
		return 0, fmt.Errorf("commit: %w", err)
	}

	return teamID, nil
}

// GetCompetitions returns all competitions, optionally filtering to open-only.
func GetCompetitions(openOnly bool) ([]model.Competition, error) {

	ctx := context.Background()

	query := `SELECT id, name, slug, description, max_team_size, min_team_size,
	                 registration_open, created_at
	          FROM competitions`

	if openOnly {
		query += ` WHERE registration_open = TRUE`
	}

	query += ` ORDER BY id ASC`

	rows, err := DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query competitions: %w", err)
	}
	defer rows.Close()

	var competitions []model.Competition

	for rows.Next() {
		var c model.Competition
		if err := rows.Scan(
			&c.ID, &c.Name, &c.Slug, &c.Description,
			&c.MaxTeamSize, &c.MinTeamSize,
			&c.RegistrationOpen, &c.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan competition: %w", err)
		}
		competitions = append(competitions, c)
	}

	return competitions, rows.Err()
}

// GetCompetitionByID returns a single competition or nil if not found.
func GetCompetitionByID(id int) (*model.Competition, error) {

	ctx := context.Background()

	var c model.Competition

	err := DB.QueryRow(
		ctx,
		`SELECT id, name, slug, description, max_team_size, min_team_size,
		        registration_open, created_at
		 FROM competitions
		 WHERE id = $1`,
		id,
	).Scan(
		&c.ID, &c.Name, &c.Slug, &c.Description,
		&c.MaxTeamSize, &c.MinTeamSize,
		&c.RegistrationOpen, &c.CreatedAt,
	)

	if err != nil {
		if err.Error() == "no rows in result set" {
			return nil, nil // not found — caller checks nil
		}
		return nil, fmt.Errorf("get competition %d: %w", id, err)
	}

	return &c, nil
}