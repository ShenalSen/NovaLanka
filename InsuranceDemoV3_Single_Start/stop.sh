#!/bin/bash
# Insurance Demo Platform - Stop Script
# Gracefully shuts down all services and cleans up resources

set -e

# ==================== CONFIGURATION ====================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Default options
REMOVE_VOLUMES=${REMOVE_VOLUMES:-false}
REMOVE_ALL=${REMOVE_ALL:-false}
INTERACTIVE=${INTERACTIVE:-true}

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

Gracefully stop the Insurance Demo Platform and clean up resources.

OPTIONS:
  --remove-volumes    Remove data volumes (WARNING: data loss) (default: false)
  --remove-all        Remove all containers, networks, and volumes (default: false)
  --non-interactive   Don't prompt for confirmation (default: interactive)
  --help              Show this help message

ENVIRONMENT VARIABLES:
  REMOVE_VOLUMES      Set to true to remove volumes
  REMOVE_ALL          Set to true to remove everything
  INTERACTIVE         Set to false for non-interactive mode (default: true)

EXAMPLES:
  # Graceful stop (containers preserved)
  $0

  # Stop and remove volumes
  $0 --remove-volumes

  # Clean everything
  $0 --remove-all

  # Non-interactive mode
  $0 --non-interactive

EOF
}

# Interactive menu for selecting options
interactive_menu() {
  log_header "Stop Options"

  echo -e "${BOLD}Select cleanup options:${NC}"
  echo ""
  echo -e "${RED}${BOLD}⚠️  IMPORTANT WARNINGS:${NC}"
  echo -e "${RED}  • Option 2: Removes data volumes - DATA LOSS may occur${NC}"
  echo -e "${RED}  • Option 3: Full cleanup is IRREVERSIBLE - all images and networks will be removed${NC}"
  echo ""
  echo "1) Graceful stop only (preserve everything)"
  echo "2) Stop and remove volumes"
  echo "3) Full cleanup (remove all images and networks)"
  echo "4) Exit"
  echo ""

  read -r -p "$(echo -e ${YELLOW}Enter your choice [1-4] - [default 1]:${NC}) " choice

  choice=${choice:-1}

  case "$choice" in
    1)
      REMOVE_VOLUMES=false
      REMOVE_ALL=false
      log_success "Selected: Graceful stop only"
      ;;
    2)
      REMOVE_VOLUMES=true
      REMOVE_ALL=false
      log_warn "⚠️  WARNING: This will remove data volumes - data loss may occur"
      log_success "Selected: Stop and remove volumes"
      ;;
    3)
      REMOVE_VOLUMES=true
      REMOVE_ALL=true
      log_warn "⚠️  WARNING: This will perform full cleanup - this action is irreversible"
      log_success "Selected: Full cleanup"
      ;;
    4)
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
      --remove-volumes)
        REMOVE_VOLUMES=true
        shift
        ;;
      --remove-all)
        REMOVE_ALL=true
        REMOVE_VOLUMES=true
        shift
        ;;
      --non-interactive)
        INTERACTIVE=false
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

# Confirm action
confirm() {
  if [ "$INTERACTIVE" != "true" ]; then
    return 0
  fi

  local prompt="$1"

  echo -e "${YELLOW}$prompt${NC} (yes/no): yes"
  return 0
}

# ==================== STOP FUNCTIONS ====================

# Check if containers are running
containers_running() {
  docker-compose ps 2>/dev/null | grep -q "insurance" || return 1
}

# Stop containers gracefully
stop_containers() {
  log_step "Stopping containers gracefully..."

  if ! containers_running; then
    log_info "No running containers found"
    return 0
  fi

  if docker-compose stop --timeout=30; then
    log_success "Containers stopped gracefully"
  else
    log_error "Failed to stop containers gracefully"
    return 1
  fi
}

# Remove containers
remove_containers() {
  log_step "Removing containers..."

  if ! containers_running; then
    log_info "No running containers to remove"
  fi

  if docker-compose rm -f; then
    log_success "Containers removed"
  else
    log_warn "Some containers may not have been removed"
  fi
}

# Remove volumes
remove_volumes() {
  if [ "$REMOVE_VOLUMES" != "true" ]; then
    log_info "Volumes preserved (use --remove-volumes to delete)"
    return 0
  fi

  if ! confirm "Are you sure you want to remove data volumes? This cannot be undone."; then
    log_warn "Volume removal cancelled"
    return 0
  fi

  log_step "Removing data volumes..."

  if docker-compose down -v; then
    log_success "Data volumes removed"
  else
    log_warn "Some volumes may not have been removed"
  fi
}

# Remove networks and orphans
remove_networks_and_orphans() {
  log_step "Removing networks and orphaned resources..."

  if docker-compose down --remove-orphans 2>/dev/null || true; then
    log_success "Networks and orphaned resources cleaned up"
  fi
}

# Cleanup dangling resources
cleanup_dangling_resources() {
  if [ "$REMOVE_ALL" != "true" ]; then
    return 0
  fi

  if ! confirm "Remove all dangling images and networks? This is irreversible."; then
    log_warn "Dangling resource cleanup cancelled"
    return 0
  fi

  log_step "Cleaning up dangling resources..."

  local dangling_images
  local dangling_networks

  # Remove dangling images
  dangling_images=$(docker images -f "dangling=true" -q 2>/dev/null || echo "")
  if [ -n "$dangling_images" ]; then
    log_info "Removing dangling images..."
    docker rmi $dangling_images 2>/dev/null || log_warn "Could not remove some dangling images"
  fi

  # Remove dangling networks
  dangling_networks=$(docker network ls -f "dangling=true" -q 2>/dev/null || echo "")
  if [ -n "$dangling_networks" ]; then
    log_info "Removing dangling networks..."
    docker network rm $dangling_networks 2>/dev/null || log_warn "Could not remove some dangling networks"
  fi

  log_success "Dangling resource cleanup completed"
}

# Display cleanup summary
display_summary() {
  log_header "Stop and Cleanup Summary"

  echo -e "${BOLD}Actions Performed:${NC}"
  echo -e "  ✓ Containers stopped gracefully"
  [ "$REMOVE_VOLUMES" = "true" ] && echo -e "  ✓ Data volumes removed"
  [ "$REMOVE_ALL" = "true" ] && echo -e "  ✓ All resources cleaned up"
  echo ""

  echo -e "${BOLD}Remaining Resources:${NC}"
  local running_count
  local container_count
  local volume_count

  running_count=$(docker-compose ps -q 2>/dev/null | wc -l)
  container_count=$(docker ps -a --filter "label=com.docker.compose.project" -q 2>/dev/null | wc -l)
  volume_count=$(docker volume ls -q --filter "label=com.docker.compose.project" 2>/dev/null | wc -l)

  echo -e "  Running containers: ${running_count}"
  echo -e "  Stopped containers: ${container_count}"
  echo -e "  Data volumes: ${volume_count}"
  echo ""

  echo -e "${BOLD}Next Steps:${NC}"
  if [ "$REMOVE_VOLUMES" != "true" ]; then
    echo -e "  To preserve data:    Services and containers are preserved"
    echo -e "  To remove volumes:   $0 --remove-volumes"
  fi
  echo -e "  To restart:          ./start.sh"
  echo ""
}

# ==================== MAIN EXECUTION ====================

main() {
  log_header "Insurance Demo Platform - Shutdown"

  # If no arguments provided and interactive mode enabled, show menu
  if [ $# -eq 0 ] && [ "$INTERACTIVE" = "true" ]; then
    interactive_menu
  else
    # Parse command-line arguments
    parse_arguments "$@"
  fi

  # Display stop plan
  log_step "Stop Plan:"
  echo -e "  • Gracefully stop containers (30s timeout)"
  echo -e "  • Remove stopped containers"
  [ "$REMOVE_VOLUMES" = "true" ] && echo -e "  • Remove data volumes"
  [ "$REMOVE_ALL" = "true" ] && echo -e "  • Remove all images and networks"
  echo ""

  # Confirmation (if interactive and aggressive options enabled)
  if [ "$INTERACTIVE" = "true" ] && ([ "$REMOVE_VOLUMES" = "true" ] || [ "$REMOVE_ALL" = "true" ]); then
    if ! confirm "Proceed with shutdown and cleanup?"; then
      log_warn "Shutdown cancelled"
      exit 0
    fi
  fi

  # Execution phase
  log_header "Phase 1: Graceful Shutdown"
  stop_containers || log_warn "Container shutdown encountered issues"

  log_header "Phase 2: Cleanup"
  remove_containers
  remove_volumes
  remove_networks_and_orphans
  cleanup_dangling_resources

  # Summary
  display_summary

  log_success "Insurance Demo Platform stopped successfully!"
  return 0
}

# ==================== ENTRY POINT ====================

# Handle signals
trap 'log_warn "Shutdown interrupted"; exit 130' INT TERM

# Run main function
if main "$@"; then
  exit 0
else
  log_error "Shutdown failed"
  exit 1
fi
