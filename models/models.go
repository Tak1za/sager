package models

import "github.com/zmb3/spotify"

//Config model which defines the clientId, clientSecret and the redirectUri
type Config struct {
	ClientID     string `json:"clientId"`
	ClientSecret string `json:"clientSecret"`
	RedirectURI  string `json:"redirectUri"`
}

//Data model which defines the return response structure containing the actual data and errors if any
type Data struct {
	Data  interface{} `json:"data"`
	Error string      `json:"error"`
}

//SpotifyClient model which holds some parameters of the SpotifyClient
type SpotifyClient struct {
	Authenticator spotify.Authenticator
	Client        spotify.Client
	User          *spotify.PrivateUser
}

//CreatePlaylist model holds the request structure
type CreatePlaylist struct {
	Name   string `json:"name"`
	Public bool   `json:"public"`
}

//CreatePlaylistResponse model holds the response structure
type CreatePlaylistResponse struct {
	PlaylistID string `json:"id"`
}

//MergePlaylist model holds the request structure
type MergePlaylist struct {
	P1     string `json:"p1"`
	P2     string `json:"p2"`
	Name   string `json:"name"`
	Public bool   `json:"public"`
}

//Ids model holds the request structure
type Ids struct {
	Ids []string `json:"id"`
}
