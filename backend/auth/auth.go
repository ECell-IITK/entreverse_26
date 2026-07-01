package auth

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Errors 

var (
	ErrInvalidCredentials = errors.New("invalid username or password")
	ErrInvalidToken       = errors.New("invalid or expired token")
	ErrMissingSecret      = errors.New("JWT_SECRET environment variable is not set")
)

// Admin store 
// admins maps username → bcrypt hash.  Populated once at startup via Init.
var admins map[string]string
// Init loads admin credentials from ADMIN_CREDENTIALS and validates that
// JWT_SECRET is set.  Call this once from main before serving requests.
func Init() error {
	//  Load credentials from environment variable
	raw := os.Getenv("ADMIN_CREDENTIALS")
	if raw == "" {
		return fmt.Errorf("ADMIN_CREDENTIALS environment variable is not set")
	}

	admins = make(map[string]string)
	for _, pair := range strings.Split(raw, ",") {
		pair = strings.TrimSpace(pair)
		if pair == "" {
			continue
		}
		idx := strings.Index(pair, ":")
		if idx < 1 {
			return fmt.Errorf("ADMIN_CREDENTIALS: malformed entry %q (expected user:hash)", pair)
		}9
		username := pair[:idx]
		hash := pair[idx+1:]
		if username == "" || hash == "" {
			return fmt.Errorf("ADMIN_CREDENTIALS: empty username or hash in entry %q", pair)
		}
		admins[username] = hash
	}

	if len(admins) == 0 {
		return fmt.Errorf("ADMIN_CREDENTIALS: no valid credentials found")
	}

	//  Validate JWT secret is present 
	if os.Getenv("JWT_SECRET") == "" {
		return ErrMissingSecret
	}

	fmt.Printf("Auth: loaded %d admin account(s)\n", len(admins))
	return nil
}

// ValidateAdmin checks a plain-text password against the stored bcrypt hash.
// Returns ErrInvalidCredentials on any mismatch (no info leakage).
func ValidateAdmin(username, password string) error {
	hash, ok := admins[username]
	if !ok {
		// Still run bcrypt to avoid timing-based username enumeration.
		_ = bcrypt.CompareHashAndPassword([]byte("$2a$12$dummy"), []byte(password))
		return ErrInvalidCredentials
	}
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return ErrInvalidCredentials
	}
	return nil
}

// JWT 

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
