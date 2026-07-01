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
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy the compiled binary
COPY --from=builder /app/server .

EXPOSE 8080

# Run as non-root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["./server"]
