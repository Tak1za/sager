package helper

import (
	"github.com/Tak1za/sager/models"
	"github.com/zmb3/spotify"
)

//BaseClient model
var BaseClient models.SpotifyClient

//Authenticator global
var Authenticator spotify.Authenticator

//Client global
var Client spotify.Client

//GetMin helper returns the min of two number
func GetMin(a, b int) int {
	if a <= b {
		return a
	}
	return b
}
