package model

import "time"

// Request models 

type RegisterRequest struct {
	CompetitionID int      `json:"competition_id" binding:"required"`
	TeamName      string   `json:"team_name"      binding:"required,min=3,max=150"`
	Comments      string   `json:"comments,omitempty"`
	Members       []Member `json:"members"        binding:"required,min=1,max=5"`
}

type Member struct {
	Name     string `json:"name"      binding:"required,min=2,max=120"`
	RollNo   string `json:"roll_no"   binding:"required,max=30"`
	Email    string `json:"email"     binding:"required,email,max=150"`
	Phone    string `json:"phone"     binding:"required,min=10,max=20"`
	IsLeader bool   `json:"is_leader"`
}


type Competition struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	Slug             string    `json:"slug"`
	Description      string    `json:"description"`
	MaxTeamSize      int       `json:"max_team_size"`
	MinTeamSize      int       `json:"min_team_size"`
	RegistrationOpen bool      `json:"registration_open"`
	CreatedAt        time.Time `json:"created_at"`
}

type AllCompetitions struct {
	Competitions []Competition `json:"competitions"`
	Total        int           `json:"total"`
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