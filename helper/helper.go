package helper

import "github.com/Tak1za/sager/models"

//BaseClient model
var BaseClient models.SpotifyClient

//GetMin helper returns the min of two number
func GetMin(a, b int) int {
	if a <= b {
		return a
	}
	return b
}
