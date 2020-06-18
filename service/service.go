package service

import (
	"math"

	"github.com/Tak1za/sager/helper"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

//GetPlaylistTracks service gets the tracks from a playlist
func GetPlaylistTracks(playlistID string, token []string) ([]spotify.PlaylistTrack, error) {
	var ret []spotify.PlaylistTrack

	client := helper.BaseClient.Authenticator.NewClient(&oauth2.Token{AccessToken: token[1], TokenType: token[0]})

	tracks, err := client.GetPlaylistTracks(spotify.ID(playlistID))
	if err != nil {
		return nil, err
	}
	ret = append(ret, tracks.Tracks...)
	if tracks.Next != "" {
		for i := 1; i < int(math.Ceil(float64(tracks.Total)/100)); i++ {
			offset := i * 100
			limit := 100
			moreTracks, err := client.GetPlaylistTracksOpt(spotify.ID(playlistID), &spotify.Options{Offset: &offset, Limit: &limit}, "")
			if err != nil {
				return nil, err
			}

			ret = append(ret, moreTracks.Tracks...)
		}
	}

	return ret, nil
}
