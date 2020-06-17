package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"

	sp "github.com/zmb3/spotify"
)

type config struct {
	ClientID     string `json:"clientId"`
	ClientSecret string `json:"clientSecret"`
	RedirectURI  string `json:"redirectUri"`
}

type data struct {
	Data  interface{} `json:"data"`
	Error string      `json:"error"`
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

type createPlaylistResponse struct {
	PlaylistID string `json:"id"`
}

type mergePlaylist struct {
	P1     string `json:"p1"`
	P2     string `json:"p2"`
	Name   string `json:"name"`
	Public bool   `json:"public"`
}

type ids struct {
	Ids []string `json:"id"`
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
		r1.GET("/tracks/playlists/:id", playlistTracksHandler)
		r1.POST("/playlists", createPlaylistHandler)
		r1.POST("/playlists/merge", mergePlaylistHandler)
		r1.DELETE("/playlists/:id", deletePlaylistHandler)
		r1.DELETE("/tracks/playlists/:id", deletePlaylistTracksHandler)
	}

	router.Run()
}

func deletePlaylistTracksHandler(c *gin.Context) {
	var data data
	var req ids
	bearerToken := c.Request.Header.Get("Authorization")
	token := strings.Split(bearerToken, " ")
	client := sClient.Authenticator.NewClient(&oauth2.Token{AccessToken: token[1], TokenType: token[0]})
	playlistID := c.Param("id")
	if err := c.BindJSON(&req); err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	spIds := make([]sp.ID, len(req.Ids))
	for _, j := range req.Ids {
		spIds = append(spIds, sp.ID(j))
	}

	_, err := client.RemoveTracksFromPlaylist(sp.ID(playlistID), spIds...)
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	c.JSON(http.StatusOK, data)
}

func deletePlaylistHandler(c *gin.Context) {
	var data data
	bearerToken := c.Request.Header.Get("Authorization")
	token := strings.Split(bearerToken, " ")
	client := sClient.Authenticator.NewClient(&oauth2.Token{AccessToken: token[1], TokenType: token[0]})
	playlistID := c.Param("id")
	selectedPlaylist, err := client.GetPlaylist(sp.ID(playlistID))
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}
	playlistOwner := selectedPlaylist.Owner

	err = client.UnfollowPlaylist(sp.ID(playlistOwner.ID), sp.ID(playlistID))
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
	}
	c.JSON(http.StatusOK, data)
}

func authorizeHandler(c *gin.Context) {
	var data data
	token, err := sClient.Authenticator.Token("spotify-login", c.Request)
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	client := sClient.Authenticator.NewClient(token)
	currentUser, err := client.CurrentUser()
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	sClient.Client = client
	sClient.User = currentUser
	urlQuery := c.Request.URL.Query()
	u, err := url.Parse("http://localhost:3000/authorize")
	q := u.Query()
	q.Set("access_token", urlQuery.Get("code"))
	q.Set("state", urlQuery.Get("state"))
	u.RawQuery = q.Encode()
	c.Request.Header.Add("access_token", token.AccessToken)

	fmt.Println("Redirect URL: ", u.String())

	c.Redirect(http.StatusFound, u.String())
}

func spotifyHandler(c *gin.Context) {
	a := sp.NewAuthenticator(
		appConfig.RedirectURI,
		sp.ScopeUserLibraryRead,
		sp.ScopeUserLibraryModify,
		sp.ScopeUserReadEmail,
		sp.ScopePlaylistReadPrivate,
		sp.ScopePlaylistModifyPrivate,
		sp.ScopePlaylistModifyPublic,
		sp.ScopePlaylistReadCollaborative)
	a.SetAuthInfo(appConfig.ClientID, appConfig.ClientSecret)
	sClient.Authenticator = a
	c.Redirect(http.StatusFound, a.AuthURLWithDialog("spotify-login"))
}

func profileHandler(c *gin.Context) {
	var data data
	bearerToken := c.Request.Header.Get("Authorization")
	token := strings.Split(bearerToken, " ")
	client := sClient.Authenticator.NewClient(&oauth2.Token{AccessToken: token[1], TokenType: token[0]})
	content, err := client.CurrentUser()
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}
	data.Data = content
	c.JSON(http.StatusOK, data)
}

func playlistHandler(c *gin.Context) {
	var data data
	bearerToken := c.Request.Header.Get("Authorization")
	token := strings.Split(bearerToken, " ")
	client := sClient.Authenticator.NewClient(&oauth2.Token{AccessToken: token[1], TokenType: token[0]})
	content, err := client.CurrentUsersPlaylists()
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}
	data.Data = content.Playlists
	c.JSON(http.StatusOK, data)
}

func playlistTracksHandler(c *gin.Context) {
	var data data
	playlistID := c.Param("id")

	bearerToken := c.Request.Header.Get("Authorization")
	token := strings.Split(bearerToken, " ")

	playlistTracks, err := getPlaylistTracks(playlistID, token)
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	if playlistTracks == nil {
		playlistTracks = make([]sp.PlaylistTrack, 0)
	}
	data.Data = playlistTracks
	c.JSON(http.StatusOK, data)
}

func createPlaylistHandler(c *gin.Context) {
	var data data
	var resp createPlaylistResponse
	var req createPlaylist
	if err := c.BindJSON(&req); err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	createdPlaylist, err := sClient.Client.CreatePlaylistForUser(sClient.User.ID, req.Name, "", req.Public)
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	resp.PlaylistID = createdPlaylist.ID.String()
	c.JSON(http.StatusCreated, resp)
}

func mergePlaylistHandler(c *gin.Context) {
	var resp createPlaylistResponse
	var req mergePlaylist
	var data data

	bearerToken := c.Request.Header.Get("Authorization")
	token := strings.Split(bearerToken, " ")

	if err := c.BindJSON(&req); err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	mergedPlaylist, err := sClient.Client.CreatePlaylistForUser(sClient.User.ID, req.Name, "", req.Public)
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	data1, err := getPlaylistTracks(req.P1, token)
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	data2, err := getPlaylistTracks(req.P2, token)
	if err != nil {
		log.Println(err)
		internalErr := err.(sp.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	var allTracks []sp.ID
	for _, j := range data1 {
		allTracks = append(allTracks, j.Track.ID)
	}

	for _, j := range data2 {
		allTracks = append(allTracks, j.Track.ID)
	}

	for i := 0; i < int(math.Ceil(float64(len(allTracks))/100)); i++ {
		start := i * 100
		end := len(allTracks) % 100
		if i < len(allTracks)/100 {
			_, err = sClient.Client.AddTracksToPlaylist(mergedPlaylist.ID, allTracks[start:start+100]...)
			if err != nil {
				log.Println(err)
				internalErr := err.(sp.Error)
				data.Error = internalErr.Message
				c.JSON(internalErr.Status, data)
				return
			}
		} else {
			_, err = sClient.Client.AddTracksToPlaylist(mergedPlaylist.ID, allTracks[start:start+end]...)
			if err != nil {
				log.Println(err)
				internalErr := err.(sp.Error)
				data.Error = internalErr.Message
				c.JSON(internalErr.Status, data)
				return
			}
		}
	}

	resp.PlaylistID = mergedPlaylist.ID.String()
	c.JSON(http.StatusCreated, resp)
}

func getMin(a, b int) int {
	if a <= b {
		return a
	}
	return b
}

func getPlaylistTracks(playlistID string, token []string) ([]sp.PlaylistTrack, error) {
	var ret []sp.PlaylistTrack

	client := sClient.Authenticator.NewClient(&oauth2.Token{AccessToken: token[1], TokenType: token[0]})

	tracks, err := client.GetPlaylistTracks(sp.ID(playlistID))
	if err != nil {
		return nil, err
	}
	ret = append(ret, tracks.Tracks...)
	if tracks.Next != "" {
		for i := 1; i < int(math.Ceil(float64(tracks.Total)/100)); i++ {
			offset := i * 100
			limit := 100
			moreTracks, err := client.GetPlaylistTracksOpt(sp.ID(playlistID), &sp.Options{Offset: &offset, Limit: &limit}, "")
			if err != nil {
				return nil, err
			}

			ret = append(ret, moreTracks.Tracks...)
		}
	}

	return ret, nil
}
