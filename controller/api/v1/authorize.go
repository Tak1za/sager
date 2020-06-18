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
	helper.Authenticator = a
	c.Redirect(http.StatusFound, a.AuthURLWithDialog("spotify-login"))
}
