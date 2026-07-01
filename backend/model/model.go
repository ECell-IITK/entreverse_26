package model

import "time"


type RegisterRequest struct {
	CompetitionID    int      `json:"competition_id"    binding:"required"`
	RegistrationCode string   `json:"registration_code" binding:"required"`
	TeamName         string   `json:"team_name"         binding:"required,min=3,max=150"`
	Comments         string   `json:"comments,omitempty"`
	Members          []Member `json:"members"           binding:"required,min=1,max=5,dive"`
}

type Member struct {
	Name     string `json:"name"     binding:"required,min=2,max=120"`
	RollNo   string `json:"roll_no"  binding:"required,max=30"`
	Email    string `json:"email"    binding:"required,email,max=150"`
	Phone    string `json:"phone"    binding:"required,min=10,max=20"`
	IsLeader bool   `json:"is_leader"`
}



type Event struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description string    `json:"description"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
}

type AllEvents struct {
	Events []Event `json:"events"`
	Total  int     `json:"total"`
}



// Competition is the public-facing struct; registration_code is intentionally
// omitted so it is never leaked in GET responses.
type Competition struct {
	ID               int       `json:"id"`
	EventID          int       `json:"event_id"`
	Name             string    `json:"name"`
	Slug             string    `json:"slug"`
	Description      string    `json:"description"`
	MaxTeamSize      int       `json:"max_team_size"`
	MinTeamSize      int       `json:"min_team_size"`
	RegistrationOpen bool      `json:"registration_open"`
	CreatedAt        time.Time `json:"created_at"`
}

// CompetitionRow is used internally by the database layer when the
// registration_code is needed (e.g. during registration validation).
// It must never be serialised directly to a JSON response.
type CompetitionRow struct {
	Competition
	RegistrationCode string // not tagged — never marshalled
}

type AllCompetitions struct {
	Competitions []Competition `json:"competitions"`
	Total        int           `json:"total"`
}



type AdminLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type AdminLoginResponse struct {
	Success  bool   `json:"success"`
	Token    string `json:"token"`
	Username string `json:"username"`
	// ExpiresIn is informational (seconds).
	ExpiresIn int `json:"expires_in"`
}


type CreateCompetitionRequest struct {
	EventID          int    `json:"event_id"          binding:"required"`
	Name             string `json:"name"              binding:"required,min=3,max=150"`
	Slug             string `json:"slug"              binding:"required,min=3,max=150"`
	Description      string `json:"description"`
	MaxTeamSize      int    `json:"max_team_size"     binding:"required,min=1,max=10"`
	MinTeamSize      int    `json:"min_team_size"     binding:"required,min=1,max=10"`
	RegistrationOpen bool   `json:"registration_open"`
	RegistrationCode string `json:"registration_code" binding:"required,min=6"`
}



// TeamSummary is returned in list responses (no member detail).
type TeamSummary struct {
	TeamID        int       `json:"team_id"`
	TeamName      string    `json:"team_name"`
	CompetitionID int       `json:"competition_id"`
	Competition   string    `json:"competition"`
	TotalMembers  int       `json:"total_members"`
	SubmittedAt   time.Time `json:"submitted_at"`
}

type AllTeams struct {
	Teams []TeamSummary `json:"teams"`
	Total int           `json:"total"`
}


type RegistrationDetail struct {
	TeamID       int       `json:"team_id"`
	TeamName     string    `json:"team_name"`
	Competition  string    `json:"competition"`
	CompSlug     string    `json:"competition_slug"`
	EventName    string    `json:"event"`
	TotalMembers int       `json:"total_members"`
	Comments     string    `json:"comments,omitempty"`
	SubmittedAt  time.Time `json:"submitted_at"`
	Members      []Member  `json:"members"`
}

type RegisterResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	TeamID  int    `json:"team_id,omitempty"`
}

type ErrorResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
	Code    int    `json:"code,omitempty"`
}

type HealthResponse struct {
	Status  string `json:"status"`
	Version string `json:"version"`
}
