package database

import (
	"context"
	"fmt"

	"entreverse/backend/model"
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
func CreateCompetition(req model.CreateCompetitionRequest) (int, error) {
	ctx := context.Background()

	var id int
	err := DB.QueryRow(ctx, `
		INSERT INTO competitions
			(event_id, name, slug, description, max_team_size, min_team_size,
			 registration_open, registration_code)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
		RETURNING id`,
		req.EventID, req.Name, req.Slug, req.Description,
		req.MaxTeamSize, req.MinTeamSize,
		req.RegistrationOpen, req.RegistrationCode,
	).Scan(&id)
	if err != nil {
		if isDuplicateKeyError(err) {
			return 0, ErrDuplicateSlug
		}
		return 0, fmt.Errorf("create competition: %w", err)
	}
	return id, nil
}
