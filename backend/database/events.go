package database

import (
	"context"
	"errors"
	"fmt"

	"entreverse/backend/model"

	"github.com/jackc/pgx/v5"
)

//  Events 

// GetEvents returns all events, optionally filtered to active-only.
func GetEvents(activeOnly bool) ([]model.Event, error) {
	ctx := context.Background()

	q := `SELECT id, name, slug, description, is_active, created_at
	      FROM events`
	if activeOnly {
		q += ` WHERE is_active = TRUE`
	}
	q += ` ORDER BY id ASC`

	rows, err := DB.Query(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("query events: %w", err)
	}
	defer rows.Close()

	var out []model.Event
	for rows.Next() {
		var e model.Event
		if err := rows.Scan(&e.ID, &e.Name, &e.Slug, &e.Description, &e.IsActive, &e.CreatedAt); err != nil {
			return nil, fmt.Errorf("scan event: %w", err)
		}
		out = append(out, e)
	}
	return out, rows.Err()
}

// GetEventBySlug returns a single event or ErrNotFound.
func GetEventBySlug(slug string) (*model.Event, error) {
	ctx := context.Background()
	var e model.Event
	err := DB.QueryRow(ctx,
		`SELECT id, name, slug, description, is_active, created_at
		 FROM events WHERE slug = $1`, slug,
	).Scan(&e.ID, &e.Name, &e.Slug, &e.Description, &e.IsActive, &e.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get event by slug %q: %w", slug, err)
	}
	return &e, nil
}

// GetCompetitionsByEventID returns all competitions for a given event.
func GetCompetitionsByEventID(eventID int, openOnly bool) ([]model.Competition, error) {
	ctx := context.Background()

	q := `SELECT id, event_id, name, slug, description,
	             max_team_size, min_team_size, registration_open, created_at
	      FROM competitions
	      WHERE event_id = $1`
	if openOnly {
		q += ` AND registration_open = TRUE`
	}
	q += ` ORDER BY id ASC`

	rows, err := DB.Query(ctx, q, eventID)
	if err != nil {
		return nil, fmt.Errorf("query competitions for event %d: %w", eventID, err)
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
