package v1

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/Tak1za/sager/helper"
	"github.com/Tak1za/sager/models"
	"github.com/gin-gonic/gin"
	"github.com/zmb3/spotify"
)

var appConfig models.Config

//AuthorizeHandler deals with authorization of user to their Spotify account
// func AuthorizeHandler(c *gin.Context) {
// 	var data models.Data
// 	token, err := sClient.Authenticator.Token("spotify-login", c.Request)
// 	if err != nil {
// 		log.Println(err)
// 		internalErr := err.(spotify.Error)
// 		data.Error = internalErr.Message
// 		c.JSON(internalErr.Status, data)
// 		return
// 	}

// 	client := sClient.Authenticator.NewClient(token)
// 	currentUser, err := client.CurrentUser()
// 	if err != nil {
// 		log.Println(err)
// 		internalErr := err.(spotify.Error)
// 		data.Error = internalErr.Message
// 		c.JSON(internalErr.Status, data)
// 		return
// 	}

// 	sClient.Client = client
// 	sClient.User = currentUser
// 	urlQuery := c.Request.URL.Query()
// 	u, err := url.Parse("http://localhost:3000/authorize")
// 	q := u.Query()
// 	q.Set("access_token", urlQuery.Get("code"))
// 	q.Set("state", urlQuery.Get("state"))
// 	u.RawQuery = q.Encode()
// 	c.Request.Header.Add("access_token", token.AccessToken)

// 	fmt.Println("Redirect URL: ", u.String())

// 	c.Redirect(http.StatusFound, u.String())
// }

//LoginHandler deals with authorization of user to their Spotify account
func LoginHandler(c *gin.Context) {
	settings, err := os.Open("appsettings.json")
	if err != nil {
		panic(err)
	}
	data, _ := ioutil.ReadAll(settings)
	json.Unmarshal(data, &appConfig)

	a := spotify.NewAuthenticator(
		appConfig.RedirectURI,
		spotify.ScopeUserLibraryRead,
		spotify.ScopeUserLibraryModify,
		spotify.ScopeUserReadEmail,
		spotify.ScopePlaylistReadPrivate,
		spotify.ScopePlaylistModifyPrivate,
		spotify.ScopePlaylistModifyPublic,
		spotify.ScopePlaylistReadCollaborative)
	a.SetAuthInfo(appConfig.ClientID, appConfig.ClientSecret)
	helper.BaseClient.Authenticator = a
	c.Redirect(http.StatusFound, a.AuthURLWithDialog("spotify-login"))
}
