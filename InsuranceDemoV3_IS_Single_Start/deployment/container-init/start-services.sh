#!/bin/bash
# Start Services Script
# Starts WSO2 services in the container

# Note: NOT using set -e because we want to attempt all services even if one times out
# Error handling is done explicitly in main()

# Source environment to get JAVA_HOME
. /etc/profile 2>/dev/null || true
. /etc/environment 2>/dev/null || true

# ==================== JAVA SETUP ====================
# Dynamically determine JAVA_HOME if not already set
if [ -z "$JAVA_HOME" ]; then
  export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
fi

if [ -z "$JAVA_HOME" ] || [ ! -d "$JAVA_HOME" ]; then
  log_error "JAVA_HOME not found or invalid"
  exit 1
fi

export PATH="$JAVA_HOME/bin:$PATH"

# Configuration
# Space-separated list of services to start; defaults to all three
SERVICE_TYPES=${SERVICE_TYPES:-"wso2is wso2am wso2mi wso2icp"}  # options: wso2is wso2am wso2mi wso2icp

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
  echo -e "${BLUE}ℹ️  [START-SERVICES] $*${NC}"
}

log_success() {
  echo -e "${GREEN}✅ [START-SERVICES] $*${NC}"
}

log_error() {
  echo -e "${RED}❌ [START-SERVICES] $*${NC}"
}

# Detect and start appropriate service
start_wso2_service() {
  local service_type="$1"
  
  case "$service_type" in
    wso2am)
      start_api_manager
      ;;
    wso2is)
      start_identity_server
      ;;
    wso2mi)
      start_micro_integrator
      ;;
    wso2icp)
      start_integration_control_plane
      ;;
    *)
      log_error "Unknown service type: $service_type"
      return 1
      ;;
  esac
}

# Start WSO2 API Manager
start_api_manager() {
  log_info "Starting WSO2 API Manager..."
  
  local apim_home="/home/wso2carbon/wso2am"
  local log_file="${apim_home}/repository/logs/wso2carbon.log"
  
  if [ ! -d "$apim_home" ]; then
    log_error "API Manager home not found: $apim_home"
    return 1
  fi
  
  # Start the service in background
  "$apim_home/bin/api-manager.sh" &
  local service_pid=$!
  
  # Wait for service to be ready
  log_info "Waiting for API Manager to initialize..."
  local max_retries=120
  local retry=0
  
  while [ $retry -lt $max_retries ]; do
    if [ -f "$log_file" ] && grep -q "Mgt Console URL" "$log_file" 2>/dev/null; then
      log_success "API Manager started successfully"
      sleep 3  # Additional wait for complete initialization
      return 0
    fi
    
    retry=$((retry + 1))
    sleep 2
  done
  
  log_error "API Manager did not start within timeout"
  return 1
}

# Start WSO2 Identity Server
start_identity_server() {
  log_info "Starting WSO2 Identity Server..."
  
  local is_home="/home/wso2carbon/wso2is"
  local log_file="${is_home}/repository/logs/wso2carbon.log"
  local start_cmd="${is_home}/bin/wso2server.sh"
  
  if [ ! -d "$is_home" ]; then
    log_error "Identity Server home not found: $is_home"
    return 1
  fi

  if [ ! -x "$start_cmd" ]; then
    log_error "Identity Server start script not found or not executable: $start_cmd"
    return 1
  fi
  
  # Set JAVA_HOME for IS if not already set
  if [ -z "$JAVA_HOME" ]; then
    export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
  fi
  
  # Start the service in background with proper environment
  JAVA_HOME="$JAVA_HOME" "$start_cmd" &
  local service_pid=$!
  
  # Wait for service to be ready
  log_info "Waiting for Identity Server to initialize..."
  local max_retries=180
  local retry=0
  
  while [ $retry -lt $max_retries ]; do
    if [ -f "$log_file" ] && grep -q "Console URL" "$log_file" 2>/dev/null; then
      log_success "Identity Server started successfully"
      sleep 3  # Additional wait for complete initialization
      return 0
    fi
    
    retry=$((retry + 1))
    sleep 2
  done
  
  log_error "Identity Server did not start within timeout"
  return 1
}

# Start WSO2 Micro Integrator
start_micro_integrator() {
  log_info "Starting WSO2 Micro Integrator..."
  
  local mi_home="/home/wso2carbon/wso2mi"
  local log_file="${mi_home}/repository/logs/wso2carbon.log"
  local start_cmd="${mi_home}/bin/micro-integrator.sh"
  
  if [ ! -d "$mi_home" ]; then
    log_error "Micro Integrator home not found: $mi_home"
    return 1
  fi
  
  if [ ! -x "$start_cmd" ]; then
    log_error "Micro Integrator start script not found or not executable: $start_cmd"
    return 1
  fi
  
  # Set JAVA_HOME for MI if not already set
  if [ -z "$JAVA_HOME" ]; then
    export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
  fi
  
  # Start the service in background with proper environment
  JAVA_HOME="$JAVA_HOME" "$start_cmd" &
  local service_pid=$!
  
  # Wait for service to be ready
  log_info "Waiting for Micro Integrator to initialize..."
  local max_retries=180
  local retry=0
  
  while [ $retry -lt $max_retries ]; do
    if [ -f "$log_file" ] && grep -q "Started message processor\|Micro Integrator started\|ServiceBusInitializer" "$log_file" 2>/dev/null; then
      log_success "Micro Integrator started successfully"
      sleep 3  # Additional wait for complete initialization
      return 0
    fi
    
    retry=$((retry + 1))
    sleep 2
  done
  
  log_error "Micro Integrator did not start within timeout"
  return 1
}

# Start WSO2 Integration Control Plane
start_integration_control_plane() {
  log_info "Starting WSO2 Integration Control Plane..."

  local icp_home="/home/wso2carbon/wso2icp"
  local start_cmd="${icp_home}/bin/dashboard.sh"
  local log_file="${icp_home}/repository/logs/wso2carbon.log"

  if [ ! -d "$icp_home" ]; then
    log_error "Integration Control Plane home not found: $icp_home"
    return 1
  fi

  if [ ! -x "$start_cmd" ]; then
    log_error "Dashboard start script not found or not executable: $start_cmd"
    return 1
  fi

  # Ensure JAVA_HOME is set
  if [ -z "$JAVA_HOME" ]; then
    export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
  fi

  JAVA_HOME="$JAVA_HOME" "$start_cmd" &

  log_info "Waiting for Integration Control Plane Dashboard to initialize..."
  local max_retries=180
  local retry=0

  while [ $retry -lt $max_retries ]; do
    if [ -f "$log_file" ] && grep -q "WSO2 Carbon started\|Integration Control Plane\|Dashboard" "$log_file" 2>/dev/null; then
      log_success "Integration Control Plane Dashboard started successfully"
      sleep 3
      return 0
    fi

    retry=$((retry + 1))
    sleep 2
  done

  log_error "Integration Control Plane Dashboard did not start within timeout"
  return 1
}

# Main execution
main() {
  log_info "=== Starting WSO2 Services ==="

  # Start each requested service in order
  local failed_services=()
  for svc in $SERVICE_TYPES; do
    log_info "Starting service: $svc"
    start_wso2_service "$svc" || {
      log_error "Failed to start service: $svc"
      failed_services+=("$svc")
    }
  done

  # Report overall status
  if [ ${#failed_services[@]} -eq 0 ]; then
    log_success "All requested services started successfully"
    return 0
  else
    log_error "Failed to start services: ${failed_services[*]}"
    # Don't exit - let container continue running for debugging
    return 1
  fi
}

# Keep container running
keep_running() {
  log_info "Services are running. Keeping container alive..."
  tail -f /dev/null  # Keep process running
}

main "$@"
keep_running
