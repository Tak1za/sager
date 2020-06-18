package v1

import (
	"log"
	"math"
	"net/http"

	"github.com/Tak1za/sager/helper"
	"github.com/Tak1za/sager/models"
	"github.com/Tak1za/sager/service"
	"github.com/gin-gonic/gin"
	"github.com/zmb3/spotify"
)

//DeletePlaylistHandler deals with removing/unfollowing a playlist
func DeletePlaylistHandler(c *gin.Context) {
	var data models.Data
	playlistID := c.Param("id")
	selectedPlaylist, err := helper.Client.GetPlaylist(spotify.ID(playlistID))
	if err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}
	playlistOwner := selectedPlaylist.Owner

	err = helper.Client.UnfollowPlaylist(spotify.ID(playlistOwner.ID), spotify.ID(playlistID))
	if err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
	}
	c.JSON(http.StatusOK, data)
}

//PlaylistHandler deals with getting the playlists of the logged in user
func PlaylistHandler(c *gin.Context) {
	var data models.Data
	content, err := helper.Client.CurrentUsersPlaylists()
	if err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}
	data.Data = content.Playlists
	c.JSON(http.StatusOK, data)
}

//CreatePlaylistHandler deals with creating a playlist
func CreatePlaylistHandler(c *gin.Context) {
	var data models.Data
	var resp models.CreatePlaylistResponse
	var req models.CreatePlaylist
	if err := c.BindJSON(&req); err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	createdPlaylist, err := helper.Client.CreatePlaylistForUser(helper.BaseClient.User.ID, req.Name, "", req.Public)
	if err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	resp.PlaylistID = createdPlaylist.ID.String()
	c.JSON(http.StatusCreated, resp)
}

//MergePlaylistHandler deals with merging two playlists together
func MergePlaylistHandler(c *gin.Context) {
	var resp models.CreatePlaylistResponse
	var req models.MergePlaylist
	var data models.Data

	mergedPlaylist, err := helper.Client.CreatePlaylistForUser(helper.BaseClient.User.ID, req.Name, "", req.Public)
	if err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	data1, err := service.GetPlaylistTracks(req.P1)
	if err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	data2, err := service.GetPlaylistTracks(req.P2)
	if err != nil {
		log.Println(err)
		internalErr := err.(spotify.Error)
		data.Error = internalErr.Message
		c.JSON(internalErr.Status, data)
		return
	}

	var allTracks []spotify.ID
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
			_, err = helper.Client.AddTracksToPlaylist(mergedPlaylist.ID, allTracks[start:start+100]...)
			if err != nil {
				log.Println(err)
				internalErr := err.(spotify.Error)
				data.Error = internalErr.Message
				c.JSON(internalErr.Status, data)
				return
			}
		} else {
			_, err = helper.Client.AddTracksToPlaylist(mergedPlaylist.ID, allTracks[start:start+end]...)
			if err != nil {
				log.Println(err)
				internalErr := err.(spotify.Error)
				data.Error = internalErr.Message
				c.JSON(internalErr.Status, data)
				return
			}
		}
	}

	resp.PlaylistID = mergedPlaylist.ID.String()
	c.JSON(http.StatusCreated, resp)
}
