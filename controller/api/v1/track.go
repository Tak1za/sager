package v1

import (
	"log"
	"net/http"

	"github.com/Tak1za/sager/helper"
	"github.com/Tak1za/sager/models"
	"github.com/Tak1za/sager/service"
	"github.com/gin-gonic/gin"
	"github.com/zmb3/spotify"
)

//DeletePlaylistTracksHandler deals with removing tracks from a playlist
func DeletePlaylistTracksHandler(c *gin.Context) {
	var data models.Data
	var req models.Ids

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

	_, err := helper.Client.RemoveTracksFromPlaylist(spotify.ID(playlistID), spIds...)
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

	playlistTracks, err := service.GetPlaylistTracks(playlistID)
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
