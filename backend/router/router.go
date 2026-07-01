package router

import (
	"entreverse/backend/handler"
	"entreverse/backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.New()

	r.Use(gin.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())


	r.GET("/health", handler.Health)

	api := r.Group("/api")
	{
		
		// GET /api/events                          list all events (?active=true)
		// GET /api/events/:slug                    single event by slug
		// GET /api/events/:slug/competitions        competitions for that event (?open=true)
		api.GET("/events", handler.GetEvents)
		api.GET("/events/:slug", handler.GetEventBySlug)
		api.GET("/events/:slug/competitions", handler.GetCompetitionsByEvent)

		// GET /api/competitions                    list all (?open=true)
		// GET /api/competitions/slug/:slug         by slug
		// GET /api/competitions/:id                by numeric ID
		api.GET("/competitions", handler.GetCompetitions)
		api.GET("/competitions/slug/:slug", handler.GetCompetitionBySlug)
		api.GET("/competitions/:id", handler.GetCompetitionByID)

		// POST /api/register                       submit registration (rate-limited)
		// GET  /api/registrations/:team_id         look up own registration
		api.POST("/register", middleware.RateLimit(10), handler.Register)
		api.GET("/registrations/:team_id", handler.GetRegistration)

		// POST /api/admin/login
		api.POST("/admin/login", handler.AdminLogin)

		admin := api.Group("/admin")
		admin.Use(middleware.RequireAdmin())
		{
			// Team queries
			// GET  /api/admin/teams/:team_id                     full team detail
			// GET  /api/admin/competitions/:competition_id/teams  all teams in a competition
			// GET  /api/admin/events/:event_id/teams             all teams in an event
			admin.GET("/teams/:team_id", handler.AdminGetTeamByID)
			admin.GET("/competitions/:competition_id/teams", handler.AdminGetTeamsByCompetition)
			admin.GET("/events/:event_id/teams", handler.AdminGetTeamsByEvent)

			// Competition management
			// POST /api/admin/competitions   create a new competition
			admin.POST("/competitions", handler.AdminCreateCompetition)
		}
	}

	return r
}
