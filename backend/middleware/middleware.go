package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"entreverse/backend/auth"
	"entreverse/backend/model"

	"github.com/gin-gonic/gin"
)

// ── Security Headers ──────────────────────────────────────────────────────────

// SecureHeaders sets recommended HTTP security headers on every response.
// These are no-cost, defence-in-depth hardening applied at the middleware layer.
func SecureHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Prevent browsers from MIME-sniffing the content type.
		c.Header("X-Content-Type-Options", "nosniff")
		// Block clickjacking by denying iframe embedding from other origins.
		c.Header("X-Frame-Options", "DENY")
		// Enable browser XSS filter (legacy browsers).
		c.Header("X-XSS-Protection", "1; mode=block")
		// Only send the origin as referrer (no full URL path).
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		// Force HTTPS for 1 year (only meaningful when served over TLS).
		if os.Getenv("GIN_MODE") == "release" {
			c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		}
		// Restrict what browsers can load; APIs return JSON only.
		c.Header("Content-Security-Policy",
			"default-src 'none'; frame-ancestors 'none'")
		// Remove the Go/Gin server fingerprint.
		c.Header("Server", "")
		c.Next()
	}
}

// ── CORS ──────────────────────────────────────────────────────────────────────

// CORS reads allowed origins from the ALLOWED_ORIGINS env var (comma-separated).
// In release mode, only those origins are permitted.
// In non-release mode, localhost:3000 and localhost:5173 are also allowed.
func CORS() gin.HandlerFunc {
	rawOrigins := os.Getenv("ALLOWED_ORIGINS")
	allowed := map[string]bool{}
	if rawOrigins != "" {
		for _, o := range strings.Split(rawOrigins, ",") {
			o = strings.TrimSpace(o)
			if o != "" {
				allowed[o] = true
			}
		}
	}
	if os.Getenv("GIN_MODE") != "release" {
		allowed["http://localhost:3000"] = true
		allowed["http://localhost:5173"] = true
	}

	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if allowed[origin] {
			c.Header("Access-Control-Allow-Origin", origin)
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

// ── Logger ────────────────────────────────────────────────────────────────────

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		fmt.Printf("[%s] %s %s → %d (%s)\n",
			time.Now().Format("15:04:05"),
			c.Request.Method,
			c.Request.URL.Path,
			c.Writer.Status(),
			time.Since(start),
		)
	}
}

// ── Rate limiter ──────────────────────────────────────────────────────────────

type ipEntry struct {
	mu        sync.Mutex
	count     int
	windowEnd time.Time
}

type ipLimiter struct {
	mu      sync.RWMutex
	entries map[string]*ipEntry
	limit   int
	window  time.Duration
}

var globalLimiter = &ipLimiter{
	entries: make(map[string]*ipEntry),
	limit:   20,
	window:  time.Minute,
}

func (l *ipLimiter) allow(ip string) bool {
	now := time.Now()

	l.mu.RLock()
	entry, ok := l.entries[ip]
	l.mu.RUnlock()

	if !ok {
		l.mu.Lock()
		entry, ok = l.entries[ip]
		if !ok {
			entry = &ipEntry{windowEnd: now.Add(l.window)}
			l.entries[ip] = entry
		}
		l.mu.Unlock()
	}

	entry.mu.Lock()
	defer entry.mu.Unlock()

	if now.After(entry.windowEnd) {
		entry.count = 0
		entry.windowEnd = now.Add(l.window)
	}
	entry.count++
	return entry.count <= l.limit
}

// RateLimit returns a middleware allowing at most limit requests/minute per IP.
func RateLimit(limit int) gin.HandlerFunc {
	globalLimiter.limit = limit
	return func(c *gin.Context) {
		if !globalLimiter.allow(c.ClientIP()) {
			c.JSON(http.StatusTooManyRequests, model.ErrorResponse{
				Success: false,
				Error:   "too many requests — please try again later",
				Code:    http.StatusTooManyRequests,
			})
			c.Abort()
			return
		}
		c.Next()
	}
}

// ── RequireAdmin ──────────────────────────────────────────────────────────────

// RequireAdmin validates the Bearer JWT in the Authorization header.
// On success it sets "admin_username" in the Gin context for downstream handlers.
func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			c.JSON(http.StatusUnauthorized, model.ErrorResponse{
				Success: false,
				Error:   "missing or malformed Authorization header",
				Code:    http.StatusUnauthorized,
			})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(header, "Bearer ")
		username, err := auth.ValidateToken(tokenStr)
		if err != nil {
			c.JSON(http.StatusUnauthorized, model.ErrorResponse{
				Success: false,
				Error:   "invalid or expired token",
				Code:    http.StatusUnauthorized,
			})
			c.Abort()
			return
		}

		// Make the authenticated username available to handlers.
		c.Set("admin_username", username)
		c.Next()
	}
}
