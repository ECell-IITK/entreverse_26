package database

import (
	"context"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// bcryptCost is the bcrypt cost factor for registration code hashes.
// Cost 10 is secure and reasonably fast (~100ms on modern hardware).
const bcryptCost = 10

// HashRegistrationCode generates a bcrypt hash from a plain-text code.
// Used by admins when creating/updating competitions.
func HashRegistrationCode(plain string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(plain), bcryptCost)
	if err != nil {
		return "", fmt.Errorf("bcrypt hash: %w", err)
	}
	return string(hash), nil
}

// VerifyRegistrationCode checks a plain code against its bcrypt hash.
// Uses constant-time comparison internally (bcrypt does this).
func VerifyRegistrationCode(hash, plain string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain))
	return err == nil
}

// MigratePlainCodes converts any plaintext registration codes to bcrypt hashes.
// Safe to run on every startup — skips already-hashed codes.
// bcrypt hashes start with "$2a$", "$2b$", or "$2y$".
func MigratePlainCodes(ctx context.Context) error {
	rows, err := DB.Query(ctx, `
		SELECT id, registration_code 
		FROM competitions 
		WHERE registration_code != '' 
		  AND registration_code NOT LIKE '$2%'`)
	if err != nil {
		return fmt.Errorf("query plain codes: %w", err)
	}
	defer rows.Close()

	type update struct {
		id   int
		hash string
	}
	var updates []update

	for rows.Next() {
		var id int
		var plain string
		if err := rows.Scan(&id, &plain); err != nil {
			return fmt.Errorf("scan code: %w", err)
		}
		hash, err := HashRegistrationCode(plain)
		if err != nil {
			return fmt.Errorf("hash code for comp %d: %w", id, err)
		}
		updates = append(updates, update{id, hash})
	}

	for _, u := range updates {
		_, err := DB.Exec(ctx,
			`UPDATE competitions SET registration_code = $1 WHERE id = $2`,
			u.hash, u.id,
		)
		if err != nil {
			return fmt.Errorf("update code for comp %d: %w", u.id, err)
		}
		fmt.Printf("Migrated registration code for competition %d to bcrypt hash\n", u.id)
	}

	if len(updates) > 0 {
		fmt.Printf("Migrated %d registration code(s) to bcrypt hashes\n", len(updates))
	}

	return nil
}
