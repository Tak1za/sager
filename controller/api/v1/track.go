package v1

import (
	"log"
	"net/http"
	"strings"

	"github.com/Tak1za/sager/helper"
	"github.com/Tak1za/sager/models"
	"github.com/Tak1za/sager/service"
	"github.com/gin-gonic/gin"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

//DeletePlaylistTracksHandler deals with removing tracks from a playlist
func DeletePlaylistTracksHandler(c *gin.Context) {
	var data models.Data
	var req models.Ids
	bearerToken := c.Request.Header.Get("Authorization")
	token := strings.Split(bearerToken, " ")
	client := helper.BaseClient.Authenticator.NewClient(&oauth2.Token{AccessToken: token[1], TokenType: token[0]})
	playlistID := c.Param("id")
	if err := c.BindJSON(&req); err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	var spIds []spotify.ID
	for _, j := range req.Ids {
		spIds = append(spIds, spotify.ID(j))
	}

	_, err := client.RemoveTracksFromPlaylist(spotify.ID(playlistID), spIds...)
	if err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	c.JSON(http.StatusOK, data)
}

//PlaylistTracksHandler deals with getting tracks of a playlist
func PlaylistTracksHandler(c *gin.Context) {
	var data models.Data
	playlistID := c.Param("id")

	bearerToken := c.Request.Header.Get("Authorization")
	token := strings.Split(bearerToken, " ")

	playlistTracks, err := service.GetPlaylistTracks(playlistID, token)
	if err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	if playlistTracks == nil {
		playlistTracks = make([]spotify.PlaylistTrack, 0)
	}
	data.Data = playlistTracks
	c.JSON(http.StatusOK, data)
}
