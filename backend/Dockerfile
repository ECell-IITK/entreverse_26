# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Download dependencies first (cached layer unless go.mod/go.sum change)
COPY go.mod go.sum ./
RUN go mod download

# Copy source and build a static binary
COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-w -s" \
    -o /app/server \
    ./cmd/server

# ── Stage 2: Run ──────────────────────────────────────────────────────────────
FROM alpine:3.20

# ca-certificates: needed for TLS connections (e.g., cloud DB with SSL)
# netcat-openbsd used to probe DB during startup; bash/sh is used for the wrapper
RUN apk --no-cache add ca-certificates tzdata netcat-openbsd bash

WORKDIR /app

# Copy the compiled binary
COPY --from=builder /app/server .

EXPOSE 8080

# Run as non-root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Wait for Postgres to be reachable before starting the server to avoid DNS/startup races.
# Using `nc -z` to probe the DB service name `postgres` on port 5432.
CMD ["sh", "-c", "until nc -z postgres 5432; do sleep 1; done; ./server"]
