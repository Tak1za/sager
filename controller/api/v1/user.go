package v1

import (
	"log"
	"net/http"
	"strings"

	"github.com/Tak1za/sager/helper"
	"github.com/Tak1za/sager/models"
	"github.com/gin-gonic/gin"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

//ProfileHandler deals with getting profile of the logged in user
func ProfileHandler(c *gin.Context) {
	var data models.Data
	bearerToken := c.Request.Header.Get("Authorization")
	token := strings.Split(bearerToken, " ")
	client := helper.BaseClient.Authenticator.NewClient(&oauth2.Token{AccessToken: token[1], TokenType: token[0]})
	content, err := client.CurrentUser()
	if err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}
	data.Data = content
	c.JSON(http.StatusOK, data)
}
