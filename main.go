package main

import (
	"encoding/json"
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

	router.GET("/ping", pingHandler)
	router.GET("/spotify/login", spotifyHandler)

	router.Run()
}

func pingHandler(c *gin.Context) {
	var data data

	token, err := sClient.Authenticator.Token("spotify-login", c.Request)
	if err != nil {
		log.Println(err)
	}
	data.Data = token

	client := sClient.Authenticator.NewClient(token)
	sClient.Client = client

	c.JSON(http.StatusOK, data)
}

func spotifyHandler(c *gin.Context) {
	a := sp.NewAuthenticator(appConfig.RedirectUri, sp.ScopeUserLibraryRead, sp.ScopeUserReadEmail)
	a.SetAuthInfo(appConfig.ClientId, appConfig.ClientSecret)
	sClient.Authenticator = a
	c.Redirect(http.StatusFound, a.AuthURLWithDialog("spotify-login"))
}
