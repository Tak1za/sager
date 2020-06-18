package v1

import (
	"log"
	"net/http"

	"github.com/Tak1za/sager/helper"
	"github.com/Tak1za/sager/models"
	"github.com/gin-gonic/gin"
	"github.com/zmb3/spotify"
)

//ProfileHandler deals with getting profile of the logged in user
func ProfileHandler(c *gin.Context) {
	var data models.Data
	content, err := helper.Client.CurrentUser()
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
