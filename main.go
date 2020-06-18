package main

import (
	"github.com/Tak1za/sager/router"
)

func main() {
	r := router.SetupRouter()

	r.Run()
}
