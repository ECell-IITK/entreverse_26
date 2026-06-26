package handler

import (
	"net/http"
	"strconv"

	"entreverse/backend/database"
	"entreverse/backend/model"

	"github.com/gin-gonic/gin"
)

// ── Health ───────────────────────────────────────────────────

func Health(c *gin.Context) {
	c.JSON(http.StatusOK, model.HealthResponse{
		Status:  "ok",
		Version: "1.0.0",
	})
}

// ── Competitions ─────────────────────────────────────────────

// GET /api/competitions?open=true
func GetCompetitions(c *gin.Context) {

	openOnly := c.Query("open") == "true"

	competitions, err := database.GetCompetitions(openOnly)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Success: false,
			Error:   "failed to fetch competitions",
		})
		return
	}

	c.JSON(http.StatusOK, model.AllCompetitions{
		Competitions: competitions,
		Total:        len(competitions),
	})
}

// GET /api/competitions/:id
func GetCompetitionByID(c *gin.Context) {

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Success: false,
			Error:   "invalid competition id",
		})
		return
	}

	comp, err := database.GetCompetitionByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Success: false,
			Error:   "failed to fetch competition",
		})
		return
	}

	if comp == nil {
		c.JSON(http.StatusNotFound, model.ErrorResponse{
			Success: false,
			Error:   "competition not found",
		})
		return
	}

	c.JSON(http.StatusOK, comp)
}

// ── Registration ─────────────────────────────────────────────

// POST /api/register
func Register(c *gin.Context) {

	var req model.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	// ── Validate: exactly one leader ─────────────────────────
	leaderCount := 0
	for _, m := range req.Members {
		if m.IsLeader {
			leaderCount++
		}
	}
	if leaderCount != 1 {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Success: false,
			Error:   "exactly one member must be marked as leader",
		})
		return
	}

	// ── Validate: competition exists and is open ─────────────
	comp, err := database.GetCompetitionByID(req.CompetitionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Success: false,
			Error:   "failed to validate competition",
		})
		return
	}
	if comp == nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Success: false,
			Error:   "competition not found",
		})
		return
	}
	if !comp.RegistrationOpen {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Success: false,
			Error:   "registration is closed for this competition",
		})
		return
	}

	// ── Validate: team size within competition limits ─────────
	n := len(req.Members)
	if n < comp.MinTeamSize || n > comp.MaxTeamSize {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Success: false,
			Error:   "team size must be between " +
				strconv.Itoa(comp.MinTeamSize) + " and " +
				strconv.Itoa(comp.MaxTeamSize),
		})
		return
	}

	// ── Insert ───────────────────────────────────────────────
	teamID, err := database.RegisterTeam(req)
	if err != nil {
		// Surface duplicate roll/email constraint clearly
		c.JSON(http.StatusConflict, model.ErrorResponse{
			Success: false,
			Error:   "registration failed: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, model.RegisterResponse{
		Success: true,
		Message: "team registered successfully",
		TeamID:  teamID,
	})
}