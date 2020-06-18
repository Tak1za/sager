package middlewares

import (
	"log"
	"net/http"
	"strings"

	"github.com/Tak1za/sager/helper"
	"github.com/gin-gonic/gin"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

//AuthenticationRequired method pulls the Bearer Token from header and initiates the client if token is valid
func AuthenticationRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		bearerToken := c.Request.Header.Get("Authorization")
		if bearerToken == "" {
			log.Println("No access token provided")
			c.JSON(http.StatusBadRequest, gin.H{"error": "No access token provided"})
			c.Abort()
			return
		}
		token := strings.Split(bearerToken, " ")
		client := helper.Authenticator.NewClient(&oauth2.Token{AccessToken: token[1], TokenType: token[0]})
		_, err := client.CurrentUser()
		if err != nil {
			log.Println(err)
			internalErr := err.(spotify.Error)
			c.JSON(internalErr.Status, gin.H{"error": internalErr.Message})
			c.Abort()
			return
		}

		helper.Client = client
		c.Next()
	}
}
