#!/bin/bash
# Insurance Demo Platform - Start Script
# Starts Docker containers only. All service initialization happens in containers.

set -e

# ==================== CONFIGURATION ====================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Default options
REBUILD_IMAGES=${REBUILD_IMAGES:-false}
NO_CACHE=${NO_CACHE:-false}
FOLLOW_LOGS=${FOLLOW_LOGS:-false}
DETACH_MODE=${DETACH_MODE:-true}

# Colors and formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ==================== UTILITY FUNCTIONS ====================

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

log_step() {
  echo -e "${BOLD}▶️  $*${NC}"
}

# Print usage information
print_usage() {
  cat << EOF
Usage: $0 [OPTIONS]

Start the Insurance Demo Platform Docker containers.
All service initialization runs inside containers.

OPTIONS:
  --rebuild           Rebuild Docker images (default: false)
  --no-cache          Build without Docker layer cache (default: false)
  --follow-logs       Follow container logs after start (default: false)
  --foreground        Run containers in foreground (default: detached)
  --help              Show this help message

ENVIRONMENT VARIABLES:
  REBUILD_IMAGES      Set to true to rebuild images
  NO_CACHE            Set to true to build without cache
  FOLLOW_LOGS         Set to true to follow logs
  DETACH_MODE         Set to false for foreground mode (default: true)

EXAMPLES:
  # Standard start
  $0

  # Rebuild images and start
  $0 --rebuild

  # Start and follow logs
  $0 --follow-logs

  # Start in foreground
  $0 --foreground

EOF
}

# Interactive menu for selecting options
interactive_menu() {
  log_header "Start Options"

  echo -e "${BOLD}Select startup options:${NC}"
  echo ""
  echo "1) Standard start (use existing containers)"
  echo "2) Rebuild and start (rebuild images before starting)"
  echo "3) Start and follow logs"
  echo "4) Start in foreground mode"
  echo "5) Full rebuild with cache purge (no cache)"
  echo "6) Exit"
  echo ""

  read -r -p "$(echo -e ${YELLOW}Enter your choice [1-6] - [default 1]:${NC}) " choice

  choice=${choice:-1}

  case "$choice" in
    1)
      REBUILD_IMAGES=false
      NO_CACHE=false
      FOLLOW_LOGS=false
      DETACH_MODE=true
      log_success "Selected: Standard start"
      ;;
    2)
      REBUILD_IMAGES=true
      NO_CACHE=false
      FOLLOW_LOGS=false
      DETACH_MODE=true
      log_warn "⚠️  Image rebuild enabled"
      log_success "Selected: Rebuild and start"
      ;;
    3)
      REBUILD_IMAGES=false
      NO_CACHE=false
      FOLLOW_LOGS=true
      DETACH_MODE=true
      log_success "Selected: Start and follow logs"
      ;;
    4)
      REBUILD_IMAGES=false
      NO_CACHE=false
      FOLLOW_LOGS=false
      DETACH_MODE=false
      log_success "Selected: Foreground mode"
      ;;
    5)
      REBUILD_IMAGES=true
      NO_CACHE=true
      FOLLOW_LOGS=false
      DETACH_MODE=true
      log_warn "⚠️  Full rebuild with cache purge (this will take longer)"
      log_success "Selected: Full rebuild without cache"
      ;;
    6)
      log_info "Exit selected"
      exit 0
      ;;
    *)
      log_error "Invalid choice: $choice"
      interactive_menu
      ;;
  esac
}

# Parse command-line arguments
parse_arguments() {
  while [ $# -gt 0 ]; do
    case "$1" in
      --rebuild)
        REBUILD_IMAGES=true
        shift
        ;;
      --no-cache)
        NO_CACHE=true
        shift
        ;;
      --follow-logs)
        FOLLOW_LOGS=true
        shift
        ;;
      --foreground)
        DETACH_MODE=false
        shift
        ;;
      --help)
        print_usage
        exit 0
        ;;
      *)
        log_error "Unknown option: $1"
        print_usage
        exit 1
        ;;
    esac
  done
}

# ==================== VALIDATION FUNCTIONS ====================

# Check if command exists
command_exists() {
  command -v "$1" &> /dev/null
}

# Validate required tools
validate_tools() {
  log_step "Validating required tools..."

  local required_tools=(
    "docker"
    "docker-compose"
  )

  local missing_tools=()

  for tool in "${required_tools[@]}"; do
    if command_exists "$tool"; then
      log_success "Found $tool"
    else
      log_error "Missing $tool"
      missing_tools+=("$tool")
    fi
  done

  if [ ${#missing_tools[@]} -gt 0 ]; then
    log_error "Missing required tools: ${missing_tools[*]}"
    return 1
  fi

  log_success "All required tools validated"
}

# Validate Docker daemon
validate_docker() {
  log_step "Validating Docker daemon..."

  if ! docker ps > /dev/null 2>&1; then
    log_error "Docker daemon is not running or you don't have permission"
    log_info "Please start Docker and ensure your user is in the docker group"
    return 1
  fi

  log_success "Docker daemon is running"
}

# Validate environment file
validate_env() {
  log_step "Validating environment configuration..."

  if [ ! -f .env ]; then
    log_error ".env file not found"
    return 1
  fi

  log_success ".env file found"
  
  log_success "Environment configuration validated"
}

# Setup environment files from samples if they don't exist
setup_env_files() {
  log_step "Setting up environment files..."

  local env_files=(
    ".env:.env.sample"
    "deployment/config/apictl.env:deployment/config/apictl.env.sample"
    "deployment/config/iamctl.env:deployment/config/iamctl.env.sample"
  )

  for env_pair in "${env_files[@]}"; do
    IFS=':' read -r env_file sample_file <<< "$env_pair"
    
    if [ ! -f "$env_file" ]; then
      if [ -f "$sample_file" ]; then
        log_info "Creating $env_file from $sample_file..."
        cp "$sample_file" "$env_file"
        log_success "Created $env_file"
      else
        log_error "Sample file not found: $sample_file"
        return 1
      fi
    else
      log_info "$env_file already exists"
    fi
  done

  log_success "Environment files setup completed"
}

# ==================== SETUP FUNCTIONS ====================

# Clean up old resources (idempotent)
cleanup_old_resources() {
  log_step "Cleaning up old containers and networks (if any)..."

  if docker-compose ps 2>/dev/null | grep -q "insurance"; then
    log_info "Found existing containers, stopping gracefully..."
    docker-compose down --remove-orphans 2>/dev/null || true
    sleep 2
  fi

  log_success "Cleanup completed"
}

# Build Docker images
build_images() {
  if [ "$REBUILD_IMAGES" != "true" ]; then
    log_info "Image rebuild skipped (use --rebuild to force rebuild)"
    return 0
  fi

  log_step "Building Docker images..."

  local build_opts=""
  if [ "$NO_CACHE" = "true" ]; then
    build_opts="--no-cache"
    log_warn "Building without cache (this may take longer)"
  fi

  if docker-compose build $build_opts; then
    log_success "Docker images built successfully"
  else
    log_error "Docker image build failed"
    return 1
  fi
}

# Start Docker services
start_services() {
  log_step "Starting Docker services..."

  local compose_opts=()
  if [ "$DETACH_MODE" = "true" ]; then
    compose_opts+=("-d")
  fi

  if docker-compose up "${compose_opts[@]}"; then
    log_success "Docker services started successfully"
  else
    log_error "Failed to start Docker services"
    return 1
  fi

  # Wait for basic service readiness in detached mode
  if [ "$DETACH_MODE" = "true" ]; then
    log_info "Waiting for basic container startup (15 seconds)..."
    sleep 15
  fi
}

# ==================== STATUS FUNCTIONS ====================

# Display startup summary
display_summary() {
  log_header "Insurance Demo Platform - Started"

  set -a
  # shellcheck disable=SC1091
  source .env
  set +a

  echo -e "${BOLD}Service Endpoints:${NC}"
  echo -e "  API Manager Console:       ${GREEN}https://localhost:${APIM_CONSOLE_PORT:-9446}${NC}"
  echo -e "  Identity Server:           ${GREEN}https://localhost:${IS_CONSOLE_PORT:-9443}${NC}"
  echo -e "  Frontend Application:      ${GREEN}http://localhost:${FRONTEND_PORT:-5173}${NC}"
  echo -e "  Integration Control Plane: ${GREEN}http://localhost:${ICP_PORT:-9743}${NC}"
  echo -e "  Database:                  ${GREEN}localhost:${MYSQL_HOST_PORT:-3306}${NC}"
  echo ""

  echo -e "${BOLD}Useful Commands:${NC}"
  echo -e "  View logs:              ${BLUE}docker-compose logs -f${NC}"
  echo -e "  View specific service:  ${BLUE}docker-compose logs -f <service-name>${NC}"
  echo -e "  Stop services:          ${BLUE}./stop.sh${NC}"
  echo -e "  Check service status:   ${BLUE}docker-compose ps${NC}"
  echo ""

  echo -e "${BOLD}Service Initialization:${NC}"
  echo -e "  Services are initializing in containers."
  echo -e "  Run: ${BLUE}docker-compose logs -f${NC} to monitor initialization"
  echo ""

  if [ "$FOLLOW_LOGS" = "true" ]; then
    echo -e "${BOLD}Following container logs (press Ctrl+C to exit):${NC}"
    echo ""
    docker-compose logs -f
  fi
}

# ==================== MAIN EXECUTION ====================

main() {
  log_header "Insurance Demo Platform - Docker Startup"

  # If no arguments provided, show interactive menu
  if [ $# -eq 0 ]; then
    interactive_menu
  else
    # Parse command-line arguments
    parse_arguments "$@"
  fi

  # Validation phase
  log_header "Phase 1: Validation"
  setup_env_files || exit 1
  validate_tools || exit 1
  validate_docker || exit 1
  validate_env || exit 1

  # Preparation phase
  log_header "Phase 2: Preparation"
  cleanup_old_resources || exit 1
  build_images || exit 1

  # Service startup phase
  log_header "Phase 3: Starting Services"
  start_services || exit 1

  # Display summary and next steps
  display_summary

  log_success "Docker containers started successfully!"
  log_info "Service initialization is running inside containers."
  return 0
}

# ==================== ENTRY POINT ====================

# Handle signals
trap 'log_warn "Startup interrupted"; exit 130' INT TERM

# Run main function
if main "$@"; then
  exit 0
else
  log_error "Docker startup failed"
  exit 1
fi
