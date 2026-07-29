package auth

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"entreverse/backend/database"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// ── Errors ────────────────────────────────────────────────────────────────────

var (
	ErrInvalidCredentials = errors.New("invalid username or password")
	ErrInvalidToken       = errors.New("invalid or expired token")
	ErrMissingSecret      = errors.New("JWT_SECRET environment variable is not set")
)

// ── Init ──────────────────────────────────────────────────────────────────────

// Init validates that the JWT_SECRET is set.
// Admin credentials are now stored in the database (loaded by database.SeedAdmins),
// so no ADMIN_CREDENTIALS env var is required.
func Init() error {
	if os.Getenv("JWT_SECRET") == "" {
		return ErrMissingSecret
	}
	fmt.Println("Auth: JWT_SECRET loaded — admin credentials served from database")
	return nil
}

// ── Validate ──────────────────────────────────────────────────────────────────

// ValidateAdmin checks a plain-text password against the bcrypt hash stored in
// the admins table.  Returns ErrInvalidCredentials on any mismatch so no
// information about whether the username exists is leaked.
func ValidateAdmin(username, password string) error {
	hash, err := database.GetAdminHash(username)
	if err != nil {
		// Username not found — run bcrypt anyway to prevent timing side-channel.
		_ = bcrypt.CompareHashAndPassword(
			[]byte("$2a$10$dummydummydummydummydummydummydummydummydummydummyd"),
			[]byte(password),
		)
		return ErrInvalidCredentials
	}
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return ErrInvalidCredentials
	}
	return nil
}

// ── JWT ───────────────────────────────────────────────────────────────────────

// Claims is the payload stored inside each issued JWT.
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func jwtSecret() []byte {
	return []byte(os.Getenv("JWT_SECRET"))
}

func ttl() time.Duration {
	if h, err := strconv.Atoi(os.Getenv("JWT_TTL_HOURS")); err == nil && h > 0 {
		return time.Duration(h) * time.Hour
	}
	return 8 * time.Hour
}

// IssueToken creates a signed JWT for the given admin username.
func IssueToken(username string) (string, error) {
	now := time.Now()
	claims := Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(ttl())),
			Issuer:    "entreverse-api",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret())
}

// ValidateToken parses and validates a JWT string.
// Returns the username embedded in the token, or ErrInvalidToken.
func ValidateToken(tokenStr string) (string, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return jwtSecret(), nil
	})
	if err != nil || !token.Valid {
		return "", ErrInvalidToken
	}
	claims, ok := token.Claims.(*Claims)
	if !ok {
		return "", ErrInvalidToken
	}
	return claims.Username, nil
}
