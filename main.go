package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	sp "github.com/zmb3/spotify"
)

type config struct {
	ClientId     string `json:"clientId"`
	ClientSecret string `json:"clientSecret"`
	RedirectUri  string `json:"redirectUri"`
}

type data struct {
	Data interface{} `json:"data"`
}

type spotifyClient struct {
	Authenticator sp.Authenticator
	Client        sp.Client
	User          *sp.PrivateUser
}

type createPlaylist struct {
	Name   string `json:"name"`
	Public bool   `json:"public"`
}

type mergePlaylist struct {
	P1     string `json:"p1"`
	P2     string `json:"p2"`
	Name   string `json:"name"`
	Public bool   `json:"public"`
}

var (
	appConfig config
	sClient   spotifyClient
)

func main() {
	settings, err := os.Open("appsettings.json")
	if err != nil {
		panic(err)
	}
	data, _ := ioutil.ReadAll(settings)
	json.Unmarshal(data, &appConfig)

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/authorize", authorizeHandler)

	r1 := router.Group("/spotify")
	{
		r1.GET("/login", spotifyHandler)
		r1.GET("/profile", profileHandler)
		r1.GET("/playlists", playlistHandler)
		r1.GET("/tracks/playlists/:id", playlistTrackHandler)
		r1.POST("/playlists", createPlaylistHandler)
		r1.POST("/playlists/merge", mergePlaylistHandler)
	}

	router.Run()
}

func authorizeHandler(c *gin.Context) {
	token, err := sClient.Authenticator.Token("spotify-login", c.Request)
	if err != nil {
		log.Println(err)
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	client := sClient.Authenticator.NewClient(token)
	currentUser, err := client.CurrentUser()
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	sClient.Client = client
	sClient.User = currentUser

	c.Redirect(http.StatusFound, "spotify/profile")
}

func spotifyHandler(c *gin.Context) {
	a := sp.NewAuthenticator(
		appConfig.RedirectUri,
		sp.ScopeUserLibraryRead,
		sp.ScopeUserReadEmail,
		sp.ScopePlaylistReadPrivate,
		sp.ScopePlaylistModifyPrivate,
		sp.ScopePlaylistModifyPublic,
		sp.ScopePlaylistReadCollaborative)
	a.SetAuthInfo(appConfig.ClientId, appConfig.ClientSecret)
	sClient.Authenticator = a
	c.Redirect(http.StatusFound, a.AuthURLWithDialog("spotify-login"))
}

func profileHandler(c *gin.Context) {
	var data data
	data.Data = sClient.User
	c.JSON(http.StatusOK, data)
}

func playlistHandler(c *gin.Context) {
	var data data
	playlist, err := sClient.Client.GetPlaylistsForUser(sClient.User.ID)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	data.Data = playlist.Playlists
	c.JSON(http.StatusOK, data)
}

func playlistTrackHandler(c *gin.Context) {
	var data data
	playlistId := c.Param("id")
	tracks, err := sClient.Client.GetPlaylistTracks(sp.ID(playlistId))
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	data.Data = tracks

	c.JSON(http.StatusOK, data)
}

func createPlaylistHandler(c *gin.Context) {
	var req createPlaylist
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	_, err := sClient.Client.CreatePlaylistForUser(sClient.User.ID, req.Name, "", req.Public)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusCreated, "Created")
}

func mergePlaylistHandler(c *gin.Context) {
	var req mergePlaylist
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	newPlaylist, err := sClient.Client.CreatePlaylistForUser(sClient.User.ID, req.Name, "", req.Public)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	data1, err := sClient.Client.GetPlaylistTracks(sp.ID(req.P1))
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	fmt.Println("got p1 tracks")
	for i, j := range data1.Tracks {
		_, err := sClient.Client.AddTracksToPlaylist(newPlaylist.ID, j.Track.ID)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
		fmt.Println("added track: ", i)
	}

	data2, err := sClient.Client.GetPlaylistTracks(sp.ID(req.P2))
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	fmt.Println("got p2 tracks")
	for i, j := range data2.Tracks {
		_, err := sClient.Client.AddTracksToPlaylist(newPlaylist.ID, j.Track.ID)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
		fmt.Println("added track: ", data1.Total+i)
	}
	c.JSON(http.StatusCreated, "Completed")
}
