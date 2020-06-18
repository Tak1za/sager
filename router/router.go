package router

import (
	"time"

	apiControllerV1 "github.com/Tak1za/sager/controller/api/v1"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

//SetupRouter function will handle the setup of all routes
func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// r.GET("/authorize", apiControllerV1.AuthorizeHandler)

	v1 := r.Group("/spotify")
	{
		v1.GET("/login", apiControllerV1.LoginHandler)
		v1.GET("/profile", apiControllerV1.ProfileHandler)
		v1.GET("/playlists", apiControllerV1.PlaylistHandler)
		v1.GET("/tracks/playlists/:id", apiControllerV1.PlaylistTracksHandler)
		v1.POST("/playlists", apiControllerV1.CreatePlaylistHandler)
		v1.POST("/playlists/merge", apiControllerV1.MergePlaylistHandler)
		v1.DELETE("/playlists/:id", apiControllerV1.DeletePlaylistHandler)
		v1.DELETE("/tracks/playlists/:id", apiControllerV1.DeletePlaylistTracksHandler)
	}

	return r
}
