#!/bin/bash
# Wait for Services Script
# Waits for MySQL and all required services to be ready before proceeding

set -e

# Configuration
MYSQL_HOST=${MYSQL_HOST:-mysql}
MYSQL_PORT=${MYSQL_PORT:-3306}
MAX_RETRIES=${MAX_RETRIES:-60}
RETRY_INTERVAL=${RETRY_INTERVAL:-2}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
  echo -e "${BLUE}ℹ️  [WAIT-SERVICES] $*${NC}"
}

log_success() {
  echo -e "${GREEN}✅ [WAIT-SERVICES] $*${NC}"
}

log_error() {
  echo -e "${RED}❌ [WAIT-SERVICES] $*${NC}"
}

# Wait for MySQL to be ready
wait_for_mysql() {
  log_info "Waiting for MySQL at ${MYSQL_HOST}:${MYSQL_PORT}..."
  
  local retry_count=0
  while [ $retry_count -lt $MAX_RETRIES ]; do
    if mysqladmin ping -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" --silent 2>/dev/null; then
      log_success "MySQL is ready"
      return 0
    fi
    
    retry_count=$((retry_count + 1))
    log_info "Attempt $retry_count/$MAX_RETRIES - Retrying in ${RETRY_INTERVAL}s..."
    sleep $RETRY_INTERVAL
  done
  
  log_error "MySQL did not become ready after $((MAX_RETRIES * RETRY_INTERVAL)) seconds"
  return 1
}

# Main execution
main() {
  log_info "=== Waiting for Services ==="
  
  wait_for_mysql || {
    log_error "Service readiness check failed"
    exit 1
  }
  
  log_success "All services are ready"
  return 0
}

main "$@"
