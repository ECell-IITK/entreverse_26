// genhash prints a bcrypt hash for the given plaintext password.
// Usage:
//	go run ./cmd/genhash mypassword
// Copy the output into ADMIN_CREDENTIALS in your .env file.
package main

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Fprintln(os.Stderr, "usage: genhash <password>")
		os.Exit(1)
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(os.Args[1]), bcrypt.DefaultCost)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	fmt.Println(string(hash))
}
