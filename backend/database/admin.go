package database

import (
	"context"
	"errors"
	"fmt"

	"entreverse/backend/model"

	"github.com/jackc/pgx/v5"
)

//  Admin DB functions 
// These are only called from admin-authenticated handlers.

// GetAllTeamsForCompetition returns a summary list of all teams for a competition.
func GetAllTeamsForCompetition(competitionID int) ([]model.TeamSummary, error) {
	ctx := context.Background()

	rows, err := DB.Query(ctx, `
		SELECT t.id, t.team_name, c.id, c.name, t.total_members, t.submitted_at
		FROM teams t
		JOIN competitions c ON c.id = t.competition_id
		WHERE t.competition_id = $1
		ORDER BY t.submitted_at ASC`, competitionID,
	)
	if err != nil {
		return nil, fmt.Errorf("query teams for competition %d: %w", competitionID, err)
	}
	defer rows.Close()

	var out []model.TeamSummary
	for rows.Next() {
		var ts model.TeamSummary
		if err := rows.Scan(
			&ts.TeamID, &ts.TeamName,
			&ts.CompetitionID, &ts.Competition,
			&ts.TotalMembers, &ts.SubmittedAt,
		); err != nil {
			return nil, fmt.Errorf("scan team summary: %w", err)
		}
		out = append(out, ts)
	}
	return out, rows.Err()
}

// GetAllTeamsForEvent returns a summary of all teams across every competition
// belonging to the given event.
func GetAllTeamsForEvent(eventID int) ([]model.TeamSummary, error) {
	ctx := context.Background()

	rows, err := DB.Query(ctx, `
		SELECT t.id, t.team_name, c.id, c.name, t.total_members, t.submitted_at
		FROM teams t
		JOIN competitions c ON c.id = t.competition_id
		WHERE c.event_id = $1
		ORDER BY c.id ASC, t.submitted_at ASC`, eventID,
	)
	if err != nil {
		return nil, fmt.Errorf("query teams for event %d: %w", eventID, err)
	}
	defer rows.Close()

	var out []model.TeamSummary
	for rows.Next() {
		var ts model.TeamSummary
		if err := rows.Scan(
			&ts.TeamID, &ts.TeamName,
			&ts.CompetitionID, &ts.Competition,
			&ts.TotalMembers, &ts.SubmittedAt,
		); err != nil {
			return nil, fmt.Errorf("scan team summary: %w", err)
		}
		out = append(out, ts)
	}
	return out, rows.Err()
}

// CreateCompetition inserts a new competition and returns its ID.
// Registration codes are hashed with bcrypt before storage.
func CreateCompetition(req model.CreateCompetitionRequest) (int, error) {
	ctx := context.Background()

	// Hash the registration code before storing
	codeHash, err := HashRegistrationCode(req.RegistrationCode)
	if err != nil {
		return 0, fmt.Errorf("hash registration code: %w", err)
	}

	var id int
	err = DB.QueryRow(ctx, `
		INSERT INTO competitions
			(event_id, name, slug, description, max_team_size, min_team_size,
			 registration_open, registration_code)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
		RETURNING id`,
		req.EventID, req.Name, req.Slug, req.Description,
		req.MaxTeamSize, req.MinTeamSize,
		req.RegistrationOpen, codeHash,
	).Scan(&id)
	if err != nil {
		if isDuplicateKeyError(err) {
			return 0, ErrDuplicateSlug
		}
		return 0, fmt.Errorf("create competition: %w", err)
	}
	return id, nil
}


// GetAllTeams returns a summary of every registered team across the entire database.
func GetAllTeams() ([]model.TeamSummary, error) {
	ctx := context.Background()

	rows, err := DB.Query(ctx, `
		SELECT t.id, t.team_name, c.id, c.name, t.total_members, t.submitted_at
		FROM teams t
		JOIN competitions c ON c.id = t.competition_id
		ORDER BY t.submitted_at DESC`)
	if err != nil {
		return nil, fmt.Errorf("query all teams: %w", err)
	}
	defer rows.Close()

	var out []model.TeamSummary
	for rows.Next() {
		var ts model.TeamSummary
		if err := rows.Scan(
			&ts.TeamID, &ts.TeamName,
			&ts.CompetitionID, &ts.Competition,
			&ts.TotalMembers, &ts.SubmittedAt,
		); err != nil {
			return nil, fmt.Errorf("scan team summary: %w", err)
		}
		out = append(out, ts)
	}
	return out, rows.Err()
}

// UpdateCompetition patches name, description, sizes, registration_open, and optionally
// the registration_code (only if req.RegistrationCode != ""). Codes are hashed before storage.
func UpdateCompetition(id int, req model.UpdateCompetitionRequest) (*model.Competition, error) {
	ctx := context.Background()

	// Build SET clause dynamically only for fields that are explicitly sent.
	// We always update the scalar fields; code only if provided.
	var err error
	if req.RegistrationCode != "" {
		// Hash the new code before storing
		codeHash, hashErr := HashRegistrationCode(req.RegistrationCode)
		if hashErr != nil {
			return nil, fmt.Errorf("hash registration code: %w", hashErr)
		}
		_, err = DB.Exec(ctx, `
			UPDATE competitions
			SET name              = $1,
			    description       = $2,
			    max_team_size     = $3,
			    min_team_size     = $4,
			    registration_open = $5,
			    registration_code = $6
			WHERE id = $7`,
			req.Name, req.Description,
			req.MaxTeamSize, req.MinTeamSize,
			req.RegistrationOpen, codeHash,
			id,
		)
	} else {
		_, err = DB.Exec(ctx, `
			UPDATE competitions
			SET name              = $1,
			    description       = $2,
			    max_team_size     = $3,
			    min_team_size     = $4,
			    registration_open = $5
			WHERE id = $6`,
			req.Name, req.Description,
			req.MaxTeamSize, req.MinTeamSize,
			req.RegistrationOpen,
			id,
		)
	}
	if err != nil {
		if isDuplicateKeyError(err) {
			return nil, ErrDuplicateSlug
		}
		return nil, fmt.Errorf("update competition %d: %w", id, err)
	}

	return GetCompetitionByID(id)
}

// ToggleCompetitionRegistration flips the registration_open flag.
func ToggleCompetitionRegistration(id int, open bool) (*model.Competition, error) {
	ctx := context.Background()
	_, err := DB.Exec(ctx,
		`UPDATE competitions SET registration_open = $1 WHERE id = $2`, open, id)
	if err != nil {
		return nil, fmt.Errorf("toggle competition %d: %w", id, err)
	}
	return GetCompetitionByID(id)
}

// CreateEvent inserts a new event.
func CreateEvent(req model.CreateEventRequest) (int, error) {
	ctx := context.Background()
	var id int
	err := DB.QueryRow(ctx, `
		INSERT INTO events (name, slug, description, is_active)
		VALUES ($1, $2, $3, $4)
		RETURNING id`,
		req.Name, req.Slug, req.Description, req.IsActive,
	).Scan(&id)
	if err != nil {
		if isDuplicateKeyError(err) {
			return 0, ErrDuplicateSlug
		}
		return 0, fmt.Errorf("create event: %w", err)
	}
	return id, nil
}

// UpdateEvent patches name, description, and is_active for an event.
func UpdateEvent(id int, req model.UpdateEventRequest) (*model.Event, error) {
	ctx := context.Background()
	_, err := DB.Exec(ctx, `
		UPDATE events
		SET name        = $1,
		    description = $2,
		    is_active   = $3
		WHERE id = $4`,
		req.Name, req.Description, req.IsActive, id,
	)
	if err != nil {
		return nil, fmt.Errorf("update event %d: %w", id, err)
	}
	var e model.Event
	err = DB.QueryRow(ctx,
		`SELECT id, name, slug, description, is_active, created_at FROM events WHERE id = $1`, id,
	).Scan(&e.ID, &e.Name, &e.Slug, &e.Description, &e.IsActive, &e.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("fetch event after update: %w", err)
	}
	return &e, nil
}

// GetEventByID returns a single event by numeric id.
func GetEventByID(id int) (*model.Event, error) {
	ctx := context.Background()
	var e model.Event
	err := DB.QueryRow(ctx,
		`SELECT id, name, slug, description, is_active, created_at FROM events WHERE id = $1`, id,
	).Scan(&e.ID, &e.Name, &e.Slug, &e.Description, &e.IsActive, &e.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get event %d: %w", id, err)
	}
	return &e, nil
}
