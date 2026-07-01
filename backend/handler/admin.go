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
