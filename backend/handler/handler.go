package handler

import (
	"errors"
	"net/http"
	"strconv"

	"entreverse/backend/database"
	"entreverse/backend/model"

	"github.com/gin-gonic/gin"
)
//  Health 

// GET /health
func Health(c *gin.Context) {
	c.JSON(http.StatusOK, model.HealthResponse{Status: "ok", Version: "1.0.0"})
}

//  Events 

// GET /api/events?active=true
func GetEvents(c *gin.Context) {
	activeOnly := c.Query("active") == "true"

	events, err := database.GetEvents(activeOnly)
	if err != nil {
		internalError(c, "failed to fetch events")
		return
	}
	if events == nil {
		events = []model.Event{}
	}
	c.JSON(http.StatusOK, model.AllEvents{Events: events, Total: len(events)})
}

// GET /api/events/:slug
func GetEventBySlug(c *gin.Context) {
	event, err := database.GetEventBySlug(c.Param("slug"))
	if err != nil {
		handleDBError(c, err, "event not found", "failed to fetch event")
		return
	}
	c.JSON(http.StatusOK, event)
}

// GET /api/events/:slug/competitions?open=true
func GetCompetitionsByEvent(c *gin.Context) {
	event, err := database.GetEventBySlug(c.Param("slug"))
	if err != nil {
		handleDBError(c, err, "event not found", "failed to fetch event")
		return
	}

	openOnly := c.Query("open") == "true"
	comps, err := database.GetCompetitionsByEventID(event.ID, openOnly)
	if err != nil {
		internalError(c, "failed to fetch competitions")
		return
	}
	if comps == nil {
		comps = []model.Competition{}
	}
	c.JSON(http.StatusOK, model.AllCompetitions{Competitions: comps, Total: len(comps)})
}

//  Competitions 

// GET /api/competitions?open=true
func GetCompetitions(c *gin.Context) {
	openOnly := c.Query("open") == "true"

	comps, err := database.GetCompetitions(openOnly)
	if err != nil {
		internalError(c, "failed to fetch competitions")
		return
	}
	if comps == nil {
		comps = []model.Competition{}
	}
	c.JSON(http.StatusOK, model.AllCompetitions{Competitions: comps, Total: len(comps)})
}

// GET /api/competitions/:id
func GetCompetitionByID(c *gin.Context) {
	id, ok := parseID(c, "id")
	if !ok {
		return
	}
	comp, err := database.GetCompetitionByID(id)
	if err != nil {
		handleDBError(c, err, "competition not found", "failed to fetch competition")
		return
	}
	c.JSON(http.StatusOK, comp)
}

// GET /api/competitions/slug/:slug
func GetCompetitionBySlug(c *gin.Context) {
	comp, err := database.GetCompetitionBySlug(c.Param("slug"))
	if err != nil {
		handleDBError(c, err, "competition not found", "failed to fetch competition")
		return
	}
	c.JSON(http.StatusOK, comp)
}

//  Registration 

// POST /api/register
func Register(c *gin.Context) {
	var req model.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, err.Error())
		return
	}

	// 1. Fetch competition (with code)
	comp, err := database.GetCompetitionRowByID(req.CompetitionID)
	if err != nil {
		handleDBError(c, err, "competition not found", "failed to validate competition")
		return
	}

	// 2. Validate registration code (bcrypt or legacy plaintext)
	// Support both bcrypt hashes ($2a$/$2b$/$2y$) and legacy plaintext for migration
	codeHash := comp.RegistrationCode
	if len(codeHash) > 4 && (codeHash[0:3] == "$2a" || codeHash[0:3] == "$2b" || codeHash[0:3] == "$2y") {
		// bcrypt hash — use constant-time verification
		if !database.VerifyRegistrationCode(codeHash, req.RegistrationCode) {
			c.JSON(http.StatusForbidden, model.ErrorResponse{
				Success: false, Error: "invalid registration code", Code: http.StatusForbidden,
			})
			return
		}
	} else {
		// Legacy plaintext — constant-time compare
		if !secureEqual(req.RegistrationCode, codeHash) {
			c.JSON(http.StatusForbidden, model.ErrorResponse{
				Success: false, Error: "invalid registration code", Code: http.StatusForbidden,
			})
			return
		}
	}

	// 3. Check registration open
	if !comp.RegistrationOpen {
		c.JSON(http.StatusGone, model.ErrorResponse{
			Success: false, Error: "registration is closed for this competition", Code: http.StatusGone,
		})
		return
	}

	// 4. Team size
	n := len(req.Members)
	if n < comp.MinTeamSize || n > comp.MaxTeamSize {
		badRequest(c, "team size must be between "+
			strconv.Itoa(comp.MinTeamSize)+" and "+strconv.Itoa(comp.MaxTeamSize)+" members")
		return
	}

	// 5. Exactly one leader
	leaders := 0
	for _, m := range req.Members {
		if m.IsLeader {
			leaders++
		}
	}
	if leaders != 1 {
		badRequest(c, "exactly one member must be marked as leader")
		return
	}

	// 6. Insert
	teamID, err := database.RegisterTeam(req)
	if err != nil {
		handleRegisterError(c, err)
		return
	}

	c.JSON(http.StatusCreated, model.RegisterResponse{
		Success: true, Message: "team registered successfully", TeamID: teamID,
	})
}

// GET /api/registrations/:team_id
func GetRegistration(c *gin.Context) {
	teamID, ok := parseID(c, "team_id")
	if !ok {
		return
	}
	detail, err := database.GetRegistrationByTeamID(teamID)
	if err != nil {
		handleDBError(c, err, "registration not found", "failed to fetch registration")
		return
	}
	c.JSON(http.StatusOK, detail)
}



func parseID(c *gin.Context, param string) (int, bool) {
	id, err := strconv.Atoi(c.Param(param))
	if err != nil {
		badRequest(c, "invalid "+param)
		return 0, false
	}
	return id, true
}

func badRequest(c *gin.Context, msg string) {
	c.JSON(http.StatusBadRequest, model.ErrorResponse{
		Success: false, Error: msg, Code: http.StatusBadRequest,
	})
}

func internalError(c *gin.Context, msg string) {
	c.JSON(http.StatusInternalServerError, model.ErrorResponse{
		Success: false, Error: msg, Code: http.StatusInternalServerError,
	})
}

func handleDBError(c *gin.Context, err error, notFoundMsg, serverMsg string) {
	if errors.Is(err, database.ErrNotFound) {
		c.JSON(http.StatusNotFound, model.ErrorResponse{
			Success: false, Error: notFoundMsg, Code: http.StatusNotFound,
		})
		return
	}
	internalError(c, serverMsg)
}

func handleRegisterError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, database.ErrDuplicateTeam),
		errors.Is(err, database.ErrDuplicateRoll),
		errors.Is(err, database.ErrDuplicateEmail):
		c.JSON(http.StatusConflict, model.ErrorResponse{
			Success: false, Error: err.Error(), Code: http.StatusConflict,
		})
	default:
		internalError(c, "registration failed: internal error")
	}
}

// secureEqual does constant-time string comparison.
func secureEqual(a, b string) bool {
	if len(a) != len(b) {
		return false
	}
	var diff byte
	for i := 0; i < len(a); i++ {
		diff |= a[i] ^ b[i]
	}
	return diff == 0
}
