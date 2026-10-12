#!/bin/bash
# Entrypoint Script for Insurance Demo Container
# Orchestrates all initialization steps in sequence

set -e

# ==================== JAVA SETUP ====================
# Dynamically determine JAVA_HOME if not already set
if [ -z "$JAVA_HOME" ]; then
  export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
  export PATH="$JAVA_HOME/bin:$PATH"
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

log_header() {
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║${NC} ${BOLD}$*${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

log_info() {
  echo -e "${BLUE}ℹ️  $*${NC}"
}

log_success() {
  echo -e "${GREEN}✅ $*${NC}"
}

log_error() {
  echo -e "${RED}❌ $*${NC}" >&2
}

log_warn() {
  echo -e "${YELLOW}⚠️  $*${NC}"
}

# Script directory
SCRIPTS_DIR="/app/container-scripts"

# Initialization marker file
INIT_MARKER="/home/wso2carbon/.initialization_complete"

# Ensure all scripts are executable
chmod +x "$SCRIPTS_DIR"/*.sh 2>/dev/null || true

# Main orchestration
main() {
  log_header "Insurance Demo Platform - Container Initialization"
  
  # Source environment profiles to set JAVA_HOME globally
  [ -f /etc/profile ] && . /etc/profile
  [ -f /etc/environment ] && . /etc/environment
  
  # Dynamically determine JAVA_HOME if not already set from profile
  if [ -z "$JAVA_HOME" ]; then
    export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
    export PATH="$JAVA_HOME/bin:$PATH"
  fi
  
  log_info "JAVA_HOME is set to: $JAVA_HOME"
  log_header "Step 1: Waiting for Services"
  if [ -f "$SCRIPTS_DIR/wait-for-services.sh" ]; then
    "$SCRIPTS_DIR/wait-for-services.sh" || {
      log_error "Service readiness check failed"
      exit 1
    }
  else
    log_warn "wait-for-services.sh not found, skipping"
  fi
  
  # Step 2: Setup database
  log_header "Step 2: Setting up Database"
  if [ -f "$SCRIPTS_DIR/setup-database.sh" ]; then
    "$SCRIPTS_DIR/setup-database.sh" || {
      log_error "Database setup failed"
      exit 1
    }
  else
    log_warn "setup-database.sh not found, skipping"
  fi
  
  # Step 3: Start services
  log_header "Step 3: Starting WSO2 Services"
  if [ -f "$SCRIPTS_DIR/start-services.sh" ]; then
    # This script starts services and keeps container running
    "$SCRIPTS_DIR/start-services.sh" &
    local services_pid=$!
  else
    log_error "start-services.sh not found"
    exit 1
  fi
  
  # Give services time to start
  log_info "Waiting for services to initialize (60 seconds)..."
  sleep 60
  
  # Check if this is the first run
  local first_run=false
  if [ ! -f "$INIT_MARKER" ]; then
    first_run=true
    log_info "First-time initialization detected"
  else
    log_info "Container previously initialized - skipping setup steps"
  fi
  
  # Step 4: Setup APIs (skip if already initialized)
  if [ "$first_run" = true ]; then
    log_header "Step 4: Setting up APIs"
    if [ -f "$SCRIPTS_DIR/setup-apis.sh" ]; then
      "$SCRIPTS_DIR/setup-apis.sh" || {
        log_warn "API setup completed with warnings (continuing)"
      }
    else
      log_warn "setup-apis.sh not found, skipping"
    fi
  else
    log_header "Step 4: APIs (Skipped - Already Configured)"
  fi
  
  # Step 5: Setup Key Manager (skip if already initialized)
  if [ "$first_run" = true ]; then
    log_header "Step 5: Setting up Key Manager"
    if [ -f "$SCRIPTS_DIR/setup-keymanager.sh" ]; then
      "$SCRIPTS_DIR/setup-keymanager.sh" || {
        log_error "Key Manager setup failed"
        exit 1
      }
    else
      log_warn "setup-keymanager.sh not found, skipping"
    fi
  else
    log_header "Step 5: Key Manager (Skipped - Already Configured)"
  fi
  
  # Step 6: Setup Users and Groups (skip if already initialized)
  if [ "$first_run" = true ]; then
    log_header "Step 6: Setting up Users and Groups"
    if [ -f "$SCRIPTS_DIR/setup-users-groups.sh" ]; then
      "$SCRIPTS_DIR/setup-users-groups.sh" || {
        log_warn "Users and groups setup completed with warnings (continuing)"
      }
    else
      log_warn "setup-users-groups.sh not found, skipping"
    fi
  else
    log_header "Step 6: Users and Groups (Skipped - Already Configured)"
  fi
  
  # Step 7: Setup Application (skip if already initialized)
  if [ "$first_run" = true ]; then
    log_header "Step 7: Setting up Application"
    if [ -f "$SCRIPTS_DIR/setup-app.sh" ]; then
      "$SCRIPTS_DIR/setup-app.sh" || {
        log_error "Application setup failed"
        exit 1
      }
    else
      log_warn "setup-app.sh not found, skipping"
    fi
    
    # Mark initialization as complete
    touch "$INIT_MARKER"
    log_success "First-time initialization completed - marker created"
  else
    log_header "Step 7: Application (Skipped - Already Configured)"
  fi
  
  # Step 8: Start Frontend
  log_header "Step 8: Starting Frontend"
  if [ -f "$SCRIPTS_DIR/start-frontend.sh" ]; then
    "$SCRIPTS_DIR/start-frontend.sh" &
    local frontend_pid=$!
    log_info "Frontend startup script running in background (PID: $frontend_pid)"
  else
    log_warn "start-frontend.sh not found, skipping"
  fi
  
  log_header "Initialization Complete"
  log_success "All startup scripts have been executed successfully"
  log_info "Services running:"
  log_info "  • Backend API: https://localhost:9446"
  log_info "  • Frontend: http://localhost:5173"
  log_info ""
  log_info "Monitor logs with: docker-compose logs -f <service-name>"
  
  # Wait for services process to keep container running
  wait $services_pid
}

# Execute main function
main "$@"
