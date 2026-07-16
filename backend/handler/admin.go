package handler

import (
	"errors"
	"net/http"
	"os"
	"strconv"

	"entreverse/backend/auth"
	"entreverse/backend/database"
	"entreverse/backend/model"

	"github.com/gin-gonic/gin"
)


// POST /api/admin/login
func AdminLogin(c *gin.Context) {
	var req model.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, err.Error())
		return
	}

	if err := auth.ValidateAdmin(req.Username, req.Password); err != nil {
		// Always return the same message — don't reveal whether user exists.
		c.JSON(http.StatusUnauthorized, model.ErrorResponse{
			Success: false,
			Error:   "invalid username or password",
			Code:    http.StatusUnauthorized,
		})
		return
	}

	token, err := auth.IssueToken(req.Username)
	if err != nil {
		internalError(c, "could not issue token")
		return
	}

	ttlHours := 8
	if h, err := strconv.Atoi(os.Getenv("JWT_TTL_HOURS")); err == nil && h > 0 {
		ttlHours = h
	}

	c.JSON(http.StatusOK, model.AdminLoginResponse{
		Success:   true,
		Token:     token,
		Username:  req.Username,
		ExpiresIn: ttlHours * 3600,
	})
}

//  Admin: team queries 
// GET /api/admin/teams/:team_id  — full detail including members
func AdminGetTeamByID(c *gin.Context) {
	teamID, ok := parseID(c, "team_id")
	if !ok {
		return
	}
	detail, err := database.GetRegistrationByTeamID(teamID)
	if err != nil {
		handleDBError(c, err, "team not found", "failed to fetch team")
		return
	}
	c.JSON(http.StatusOK, detail)
}

// GET /api/admin/competitions/:competition_id/teams  — summary list
func AdminGetTeamsByCompetition(c *gin.Context) {
	compID, ok := parseID(c, "competition_id")
	if !ok {
		return
	}

	// Verify competition exists
	if _, err := database.GetCompetitionByID(compID); err != nil {
		handleDBError(c, err, "competition not found", "failed to fetch competition")
		return
	}

	teams, err := database.GetAllTeamsForCompetition(compID)
	if err != nil {
		internalError(c, "failed to fetch teams")
		return
	}
	if teams == nil {
		teams = []model.TeamSummary{}
	}
	c.JSON(http.StatusOK, model.AllTeams{Teams: teams, Total: len(teams)})
}

// GET /api/admin/events/:event_id/teams  — all teams across all competitions of an event
func AdminGetTeamsByEvent(c *gin.Context) {
	eventID, ok := parseID(c, "event_id")
	if !ok {
		return
	}

	teams, err := database.GetAllTeamsForEvent(eventID)
	if err != nil {
		internalError(c, "failed to fetch teams")
		return
	}
	if teams == nil {
		teams = []model.TeamSummary{}
	}
	c.JSON(http.StatusOK, model.AllTeams{Teams: teams, Total: len(teams)})
}

// Admin: all teams 

// GET /api/admin/teams  — all teams across everything
func AdminGetAllTeams(c *gin.Context) {
	teams, err := database.GetAllTeams()
	if err != nil {
		internalError(c, "failed to fetch teams")
		return
	}
	if teams == nil {
		teams = []model.TeamSummary{}
	}
	c.JSON(http.StatusOK, model.AllTeams{Teams: teams, Total: len(teams)})
}

// Admin: update competition 

// PATCH /api/admin/competitions/:id
func AdminUpdateCompetition(c *gin.Context) {
	id, ok := parseID(c, "id")
	if !ok {
		return
	}

	var req model.UpdateCompetitionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, err.Error())
		return
	}

	if req.MinTeamSize > req.MaxTeamSize {
		badRequest(c, "min_team_size cannot be greater than max_team_size")
		return
	}

	comp, err := database.UpdateCompetition(id, req)
	if err != nil {
		if errors.Is(err, database.ErrNotFound) {
			c.JSON(http.StatusNotFound, model.ErrorResponse{Success: false, Error: "competition not found", Code: http.StatusNotFound})
			return
		}
		if errors.Is(err, database.ErrDuplicateSlug) {
			c.JSON(http.StatusConflict, model.ErrorResponse{Success: false, Error: "slug already in use", Code: http.StatusConflict})
			return
		}
		internalError(c, "failed to update competition")
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "competition": comp})
}

// Admin: create event 

// POST /api/admin/events
func AdminCreateEvent(c *gin.Context) {
	var req model.CreateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, err.Error())
		return
	}

	id, err := database.CreateEvent(req)
	if err != nil {
		if errors.Is(err, database.ErrDuplicateSlug) {
			c.JSON(http.StatusConflict, model.ErrorResponse{Success: false, Error: "an event with that slug already exists", Code: http.StatusConflict})
			return
		}
		internalError(c, "failed to create event")
		return
	}

	event, err := database.GetEventByID(id)
	if err != nil {
		c.JSON(http.StatusCreated, gin.H{"success": true, "id": id})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"success": true, "event": event})
}

// Admin: update event 

// PATCH /api/admin/events/:id
func AdminUpdateEvent(c *gin.Context) {
	id, ok := parseID(c, "id")
	if !ok {
		return
	}

	var req model.UpdateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, err.Error())
		return
	}

	event, err := database.UpdateEvent(id, req)
	if err != nil {
		handleDBError(c, err, "event not found", "failed to update event")
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "event": event})
}

// Admin: create competition 

// POST /api/admin/competitions
func AdminCreateCompetition(c *gin.Context) {
	var req model.CreateCompetitionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, err.Error())
		return
	}

	// min <= max sanity check
	if req.MinTeamSize > req.MaxTeamSize {
		badRequest(c, "min_team_size cannot be greater than max_team_size")
		return
	}

	id, err := database.CreateCompetition(req)
	if err != nil {
		if errors.Is(err, database.ErrDuplicateSlug) {
			c.JSON(http.StatusConflict, model.ErrorResponse{
				Success: false,
				Error:   "a competition with that slug already exists",
				Code:    http.StatusConflict,
			})
			return
		}
		internalError(c, "failed to create competition")
		return
	}

	// Return the newly created competition
	comp, err := database.GetCompetitionByID(id)
	if err != nil {
		// Created fine but fetch failed — still return the ID
		c.JSON(http.StatusCreated, gin.H{"success": true, "id": id})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"success": true, "competition": comp})
}
