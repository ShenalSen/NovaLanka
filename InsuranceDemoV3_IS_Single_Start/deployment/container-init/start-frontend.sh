#!/bin/bash
# Start Frontend Script
# Builds and starts the Insurance Frontend SPA on port 5173

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
  echo -e "${BLUE}ℹ️  [FRONTEND] $*${NC}"
}

log_success() {
  echo -e "${GREEN}✅ [FRONTEND] $*${NC}"
}

log_error() {
  echo -e "${RED}❌ [FRONTEND] $*${NC}" >&2
}

log_warn() {
  echo -e "${YELLOW}⚠️  [FRONTEND] $*${NC}"
}

# Configuration
FRONTEND_DIR=${FRONTEND_DIR:-/home/wso2/app}
FRONTEND_PORT=${FRONTEND_PORT:-5173}
FRONTEND_HOST=${FRONTEND_HOST:-0.0.0.0}
NODE_ENV=${NODE_ENV:-development}

# Main execution
main() {
  log_info "Starting Insurance Frontend SPA..."
  
  if [ ! -d "$FRONTEND_DIR" ]; then
    # Fallback to legacy paths if mounted differently
    if [ -d "/app/Frontend" ]; then
      log_warn "Primary frontend directory missing. Falling back to /app/Frontend"
      FRONTEND_DIR="/app/Frontend"
    elif [ -d "/app/docker-deployment/Frontend" ]; then
      log_warn "Primary frontend directory missing. Falling back to /app/docker-deployment/Frontend"
      FRONTEND_DIR="/app/docker-deployment/Frontend"
    else
      log_error "Frontend directory not found: $FRONTEND_DIR"
      exit 1
    fi
  fi
  
  cd "$FRONTEND_DIR"
  
  log_info "Frontend directory: $FRONTEND_DIR"
  log_info "Node version: $(node -v 2>/dev/null || echo 'not installed')"
  log_info "npm version: $(npm -v 2>/dev/null || echo 'not installed')"

  # Install dependencies if node_modules doesn't exist
  if [ ! -d "node_modules" ]; then
    log_info "Installing frontend dependencies..."
    npm install || {
      log_error "npm install failed"
      exit 1
    }
    log_success "Dependencies installed"
  else
    log_info "node_modules already exists, skipping npm install"
  fi
  
  # Always run dev server (requested)
  log_info "Starting frontend dev server on ${FRONTEND_HOST}:${FRONTEND_PORT} (no browser auto-open)..."
  BROWSER=none npm run dev -- --host "$FRONTEND_HOST" --port "$FRONTEND_PORT" --strictPort --clearScreen false
}

main "$@"
