package database

import (
	"context"
	"fmt"
)

// seedAdmin describes a single admin account baked into the binary.
// password_hash is a bcrypt hash (cost 10).  Passwords are documented in
// the deployment guide — change them via a direct DB UPDATE after first login.
type seedAdmin struct {
	username     string
	passwordHash string
}

// seededAdmins is the canonical list of bootstrap admin accounts.
// These are inserted once and never overwritten (ON CONFLICT DO NOTHING),
// so existing rows — including manually updated passwords — are preserved
// across every restart and re-deploy.
//
// Credentials (set during initial seeding):
//
//	rajc25@iitk.ac.in     → Ecell@2026
//	anand@ecelliitk.com   → Anand@Ecell26
//	hirani@ecelliitk.com  → Hirani@Ecell26
//	mohit@ecell.com       → Mohit@Ecell26
//	ecell@iitk.ac.in      → EcellIITK@26
var seededAdmins = []seedAdmin{
	{
		username:     "rajc25@iitk.ac.in",
		passwordHash: "$2a$10$WRLhS5OZX6faSX3KJsCp4.Z8mJKh36U/GiAK6zaSVAOGwheKQDfR6",
	},
	{
		username:     "anand@ecelliitk.com",
		passwordHash: "$2a$10$p02pJRKRzX3Rd2mTzNoUD.z6jvUM8CyxEEOe3Cgvr2CDEFb9hlAD.",
	},
	{
		username:     "hirani@ecelliitk.com",
		passwordHash: "$2a$10$91PR6FxOXeluc0x64.JEHegbk4KCXo8gPyUyQ0.EV5IZaAILQeAzW",
	},
	{
		username:     "mohit@ecell.com",
		passwordHash: "$2a$10$lU6IxE9zexR8RGrqNquyjONxtEJfLp6Ryvpqnd2IFToqvgcPY7gBO",
	},
	{
		username:     "ecell@iitk.ac.in",
		passwordHash: "$2a$10$6QP82Rn375U3LcHrfBQNGeScXsP8I7zsx9Sm1vEj2ifKdp1Li6V/C",
	},
}

// SeedAdmins ensures the bootstrap admin rows exist in the database.
// It is idempotent: existing rows are never touched, so password updates
// made directly in the DB survive restarts and re-deploys.
//
// Also ensures the admins table itself exists (for cases where the DB was
// provisioned from an older init.sql without the admins table).
func SeedAdmins() error {
	ctx := context.Background()

	// Create the table if it was not part of the original init.sql run.
	_, err := DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS admins (
			id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
			username       VARCHAR(150) UNIQUE NOT NULL,
			password_hash  VARCHAR(255) NOT NULL,
			created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		)`)
	if err != nil {
		return fmt.Errorf("seed: ensure admins table: %w", err)
	}

	inserted := 0
	for _, a := range seededAdmins {
		tag, err := DB.Exec(ctx, `
			INSERT INTO admins (username, password_hash)
			VALUES ($1, $2)
			ON CONFLICT (username) DO NOTHING`,
			a.username, a.passwordHash,
		)
		if err != nil {
			return fmt.Errorf("seed admin %q: %w", a.username, err)
		}
		inserted += int(tag.RowsAffected())
	}

	if inserted > 0 {
		fmt.Printf("SeedAdmins: inserted %d new admin account(s)\n", inserted)
	} else {
		fmt.Println("SeedAdmins: all admin accounts already present — no changes made")
	}
	return nil
}

// GetAdminHash returns the bcrypt hash for a given username.
// Returns ("", ErrNotFound) if the username does not exist.
func GetAdminHash(username string) (string, error) {
	ctx := context.Background()
	var hash string
	err := DB.QueryRow(ctx,
		`SELECT password_hash FROM admins WHERE username = $1`, username,
	).Scan(&hash)
	if err != nil {
		return "", ErrNotFound
	}
	return hash, nil
}
