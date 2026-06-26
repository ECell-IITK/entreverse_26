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
		// Competitions
		api.GET("/competitions", handler.GetCompetitions)       // ?open=true
		api.GET("/competitions/:id", handler.GetCompetitionByID)

		// Registration
		api.POST("/register", handler.Register)
	}

	return r
}