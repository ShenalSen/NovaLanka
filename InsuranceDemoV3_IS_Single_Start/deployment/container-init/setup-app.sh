#!/bin/bash
# Devportal Application Registration Script
# Creates application in APIM Devportal, subscribes to all APIs, and generates keys
# Idempotent - safe to re-run

set -e

# ==================== CONFIGURATION ====================

APIM_HOST=${APIM_HOST:-https://localhost:9446}
APIM_USERNAME=${APIM_USERNAME:-admin}
APIM_PASSWORD=${APIM_PASSWORD:-admin}
IS_HOST=${IS_HOST:-https://localhost:9443}
IS_USERNAME=${IS_USERNAME:-admin}
IS_PASSWORD=${IS_PASSWORD:-admin}
APP_NAME=${APP_NAME:-InsuranceFrontendApp}
APP_DESC=${APP_DESC:-"Insurance Frontend SPA"}
APP_TIER=${APP_TIER:-Unlimited}
KEY_MANAGER_NAME=${KEY_MANAGER_NAME:-WSO2IS72}
FRONTEND_URL=${FRONTEND_URL:-http://localhost:5173}
FRONTEND_CALLBACK=${FRONTEND_CALLBACK:-${FRONTEND_URL}}
MAX_RETRY=30
RETRY_INTERVAL=10

# ==================== UTILITY FUNCTIONS ====================

log_info() {
  echo "ℹ️  [DEVPORTAL-APP] $*" >&2
}

log_success() {
  echo "✅ [DEVPORTAL-APP] $*" >&2
}

log_error() {
  echo "❌ [DEVPORTAL-APP] $*" >&2
}

log_warn() {
  echo "⚠️  [DEVPORTAL-APP] $*"
}

# Wait for API Manager to be ready
wait_for_apim() {
  local retry_count=0
  local publisher_url="${APIM_HOST}/publisher"
  
  log_info "Waiting for API Manager to be fully ready..."
  
  while [ $retry_count -lt $MAX_RETRY ]; do
    if curl -sk "$publisher_url" > /dev/null 2>&1; then
      log_success "API Manager is ready"
      return 0
    fi
    retry_count=$((retry_count + 1))
    log_info "Attempt $retry_count/$MAX_RETRY - Waiting for API Manager..."
    sleep $RETRY_INTERVAL
  done
  
  log_error "API Manager did not become ready in time"
  return 1
}

# URL encode utility
url_encode() {
  echo "$1" | sed 's/ /%20/g'
}

# Generate search URL for API
generate_search_url() {
  local encoded_name
  encoded_name=$(url_encode "$1")
  echo "${APIM_HOST}/api/am/devportal/v3/search?query=name%3A${encoded_name}"
}

# Get application ID by name
get_application_id() {
  local app_name="$1"
  
  log_info "Looking up application ID for: $app_name"
  
  local app_list
  app_list=$(curl -sk -u "${APIM_USERNAME}:${APIM_PASSWORD}" \
    "${APIM_HOST}/api/am/devportal/v3/applications?limit=100" 2>/dev/null)
  
  if echo "$app_list" | grep -q "\"name\":\"${app_name}\""; then
    local app_id
    app_id=$(echo "$app_list" | grep -B5 "\"name\":\"${app_name}\"" | grep -o "\"applicationId\":\"[^\"]*\"" | head -1 | sed 's/"applicationId":"\([^"]*\)"/\1/')
    
    if [ -n "$app_id" ]; then
      log_success "Found application ID: $app_id"
      echo "$app_id"
      return 0
    fi
  fi
  
  log_info "Application not found: $app_name"
  return 1
}

# Create Devportal Application (idempotent)
create_devportal_application() {
  log_info "Creating devportal application: $APP_NAME"
  
  local payload
  payload=$(cat <<EOF
{
  "name": "${APP_NAME}",
  "throttlingPolicy": "${APP_TIER}",
  "description": "${APP_DESC}",
  "tokenType": "JWT",
  "groups": null,
  "attributes": {},
  "visibility": ""
}
EOF
)
  
  log_info "Create Application Endpoint: ${APIM_HOST}/api/am/devportal/v3/applications"
  log_info "Create Application Payload: $payload"
  
  local response http_code
  response=$(curl -sk -w "\n%{http_code}" -X POST -u "${APIM_USERNAME}:${APIM_PASSWORD}" \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "${APIM_HOST}/api/am/devportal/v3/applications" 2>&1)
  http_code=$(echo "$response" | tail -n1)
  response=$(echo "$response" | sed '$d')
  
  log_info "Create Application Response (HTTP $http_code): $response"
  
  if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    local app_id
    app_id=$(echo "$response" | grep -o '"applicationId":"[^\"]*"' | head -1 | sed 's/"applicationId":"\([^\"]*\)"/\1/')
    if [ -n "$app_id" ]; then
      log_success "Application created successfully: $app_id"
      echo "$app_id"
      return 0
    fi
  fi
  
  log_error "Failed to create application (HTTP $http_code)"
  log_error "Response: $response"
  return 1
}

# Register or get existing application
register_application() {
  log_info "Registering/locating devportal application: $APP_NAME"
  local app_id
  
  if app_id=$(get_application_id "$APP_NAME" 2>/dev/null); then
    log_success "Application already exists: $app_id"
    echo "$app_id"
    return 0
  fi
  
  log_info "Application does not exist, creating..."
  create_devportal_application
}

# Get all published APIs
get_all_apis() {
  log_info "Retrieving all published APIs..."
  
  local api_list
  api_list=$(curl -sk -u "${APIM_USERNAME}:${APIM_PASSWORD}" \
    "${APIM_HOST}/api/am/publisher/v4/apis?limit=100" 2>/dev/null)
  
  if echo "$api_list" | grep -q '"list"'; then
    echo "$api_list"
    return 0
  else
    log_error "Failed to retrieve API list"
    return 1
  fi
}

# Parse APIs from list and return as lines with "id|name" format
parse_apis_from_list() {
  local api_list="$1"
  
  echo "$api_list" > /tmp/api_list_debug.json
  
  if command -v jq &> /dev/null; then
    log_info "Using jq for API parsing"
    echo "$api_list" | jq -r '.list[] | "\(.id)|\(.name)"' 2>/dev/null || {
      log_warn "jq parsing failed, falling back to grep"
      grep_parse "$api_list"
    }
  else
    grep_parse "$api_list"
  fi
}

# Fallback grep-based parsing for API list
grep_parse() {
  local api_list="$1"
  
  echo "$api_list" | sed 's/},{/\n},\n{/g' | while read -r api_obj; do
    if [[ ! "$api_obj" =~ ^[{] ]]; then
      continue
    fi
    
    local api_id=$(echo "$api_obj" | grep -o '"id":"[^\"]*"' | head -1 | sed 's/"id":"\([^\"]*\)"/\1/')
    local api_name=$(echo "$api_obj" | grep -o '"name":"[^\"]*"' | head -1 | sed 's/"name":"\([^\"]*\)"/\1/')
    
    if [ -n "$api_id" ] && [ -n "$api_name" ]; then
      echo "${api_id}|${api_name}"
    fi
  done
}

# Subscribe to a single API
subscribe_to_api() {
  local api_id="$1"
  local api_name="$2"
  local app_id="$3"
  local throttling_tier="${4:-Unlimited}"
  
  local subscription_payload
  subscription_payload=$(cat <<EOF
{
  "apiId": "${api_id}",
  "applicationId": "${app_id}",
  "throttlingPolicy": "${throttling_tier}"
}
EOF
)
  
  local response http_code full_response
  
  full_response=$(curl -sk -w "\n%{http_code}" -X POST -u "${APIM_USERNAME}:${APIM_PASSWORD}" \
    -H "Content-Type: application/json" \
    -d "$subscription_payload" \
    "${APIM_HOST}/api/am/devportal/v3/subscriptions" 2>&1)
  
  http_code=$(echo "$full_response" | tail -n1)
  response=$(echo "$full_response" | sed '$d')
  
  if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    log_success "Subscribed to API: $api_name"
    return 0
  elif echo "$response" | grep -q "already exists"; then
    log_info "Already subscribed to API: $api_name"
    return 0
  fi
  
  if [ "$http_code" = "400" ]; then
    log_warn "Got HTTP 400, retrying without throttlingPolicy..."
    
    local simple_payload=$(cat <<EOF
{
  "apiId": "${api_id}",
  "applicationId": "${app_id}"
}
EOF
)
    
    log_info "Retry Payload (simplified): $(echo "$simple_payload" | tr '\n' ' ')"
    
    full_response=$(curl -sk -w "\n%{http_code}" -X POST -u "${APIM_USERNAME}:${APIM_PASSWORD}" \
      -H "Content-Type: application/json" \
      -d "$simple_payload" \
      "${APIM_HOST}/api/am/devportal/v3/subscriptions" 2>&1)
    
    http_code=$(echo "$full_response" | tail -n1)
    response=$(echo "$full_response" | sed '$d')
    
    log_info "Retry Response (HTTP $http_code)"
    log_info "Response Body: $response"
    
    if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
      log_success "Subscribed to API (simplified): $api_name"
      return 0
    elif echo "$response" | grep -q "already exists"; then
      log_info "Already subscribed to API: $api_name"
      return 0
    fi
  fi
  
  log_error "Failed to subscribe to API: $api_name (HTTP $http_code)"
  log_error "Full Response: $response"
  return 0
}

# Subscribe to all published APIs
subscribe_to_all_apis() {
  local app_id="$1"
  local throttling_tier="${2:-${APP_TIER}}"
  
  throttling_tier="${throttling_tier:-Unlimited}"
  
  local api_list
  if ! api_list=$(get_all_apis); then
    log_error "Cannot retrieve API list"
    return 1
  fi
  
  echo "$api_list" > /tmp/api_list.json
  > /tmp/processed_apis.txt
  
  local api_count=0
  local subscribed=0
  local failed=0
  
  while IFS='|' read -r api_id api_name; do
    if [ -z "$api_id" ] || [ -z "$api_name" ]; then
      continue
    fi
    
    log_info "Found API: $api_name (ID: $api_id)"
    
    if ! grep -q "^${api_name}$" /tmp/processed_apis.txt 2>/dev/null; then
      echo "$api_name" >> /tmp/processed_apis.txt
      api_count=$((api_count + 1))
      
      log_info "[$api_count] Subscribing application $app_id to $api_name..."
      
      if subscribe_to_api "$api_id" "$api_name" "$app_id" "$throttling_tier"; then
        subscribed=$((subscribed + 1))
      else
        failed=$((failed + 1))
        log_error "Subscription failed for $api_name"
      fi
      sleep 2
    else
      log_info "Skipping duplicate: $api_name"
    fi
  done < <(parse_apis_from_list "$api_list")
  
  log_success "API subscription completed - Total APIs: $api_count, Subscribed: $subscribed, Failed: $failed"
  return 0
}

# Register application in Identity Server
register_app_in_is() {
  local is_app_name="${1:-InsuranceFrontendApp}"
  
  log_info "Registering application in Identity Server: $is_app_name"
  
  local apps_api="${IS_HOST}/api/server/v1/applications"
  
  # Check if app already exists
  local app_list
  app_list=$(curl -sk -u "${IS_USERNAME}:${IS_PASSWORD}" \
    -H "Accept: application/json" \
    "${apps_api}?limit=100" 2>/dev/null)
  
  log_info "Checking for existing app in IS (list response): $(echo "$app_list" | head -c 200)..."
  
  local is_app_id=""
  if command -v jq &> /dev/null; then
    is_app_id=$(echo "$app_list" | jq -r ".[] | select(.name==\"${is_app_name}\") | .id" 2>/dev/null | head -1)
  else
    if echo "$app_list" | grep -q "\"name\":\"${is_app_name}\""; then
      is_app_id=$(echo "$app_list" | grep -B2 "\"name\":\"${is_app_name}\"" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"\([^"]*\)"/\1/')
    fi
  fi
  
  if [ -n "$is_app_id" ]; then
    log_success "Found existing IS application: $is_app_id"
    echo "$is_app_id"
    return 0
  fi
  
  # Create new application
  local app_payload
  app_payload=$(cat <<EOF
{
  "name": "${is_app_name}",
  "description": "Insurance Frontend Application",
  "isManagementApp": false,
  "claimConfiguration": {
    "dialect": "LOCAL",
    "requestedClaims": [
      {
          "claim": {
              "uri": "http://wso2.org/claims/groups"
          },
          "mandatory": false
      }
    ]
  }
}
EOF
)
  
  log_info "Creating new IS app with payload: $app_payload"
  
  local response http_code
  # Use -i to include headers, then extract response separately
  response=$(curl -sk -i -X POST -u "${IS_USERNAME}:${IS_PASSWORD}" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$app_payload" \
    "$apps_api" 2>&1)
  
  log_info "Full curl response (first 500 chars): $(echo "$response" | head -c 500)"
  
  # Extract HTTP code from header
  http_code=$(echo "$response" | head -1 | grep -o '[0-9]\{3\}' | head -1)
  
  # Extract body (everything after double newline)
  local response_body
  response_body=$(echo "$response" | sed -n '/^\r*$/,$p' | tail -n +2)
  
  # Extract Location header for the application ID (IS returns ID in Location header on 201)
  local is_app_id
  is_app_id=$(echo "$response" | grep -i "^Location:" | sed 's/.*\///' | tr -d '\r')
  
  log_info "IS App Creation HTTP Status: $http_code"
  log_info "IS App Response body: $response_body"
  log_info "Location header app ID: $is_app_id"
  
  if [ "$http_code" != "201" ] && [ "$http_code" != "200" ]; then
    log_error "Failed to create IS application (HTTP $http_code)"
    log_error "Response: $response_body"
    return 1
  fi
  
  # If no Location header, try parsing from response body
  if [ -z "$is_app_id" ]; then
    if command -v jq &> /dev/null && [ -n "$response_body" ]; then
      is_app_id=$(echo "$response_body" | jq -r '.id' 2>/dev/null)
    elif [ -n "$response_body" ]; then
      is_app_id=$(echo "$response_body" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"\([^"]*\)"/\1/')
    fi
  fi
  
  if [ -n "$is_app_id" ] && [ "$is_app_id" != "null" ]; then
    log_success "IS Application created: $is_app_id"
    echo "$is_app_id"
    return 0
  fi
  
  log_error "Could not extract application ID from IS response"
  log_error "Response body: $response_body"
  return 1
}

# Configure OIDC for IS application
configure_oidc_in_is() {
  local is_app_id="$1"
  
  log_info "Configuring OIDC for IS app: $is_app_id"
  
  local oidc_url="${IS_HOST}/api/server/v1/applications/${is_app_id}/inbound-protocols/oidc"
  
  local oidc_payload
  oidc_payload=$(cat <<EOF
{
  "grantTypes": [
    "authorization_code",
    "refresh_token"
  ],
  "callbackURLs": [
    "regexp=(${FRONTEND_URL}|${FRONTEND_URL}/)"
  ],
  "allowedOrigins": [
    "${FRONTEND_URL}"
  ],
  "publicClient": true
}
EOF
)
  
  local response http_code
  response=$(curl -sk -w "\n%{http_code}" -X PUT -u "${IS_USERNAME}:${IS_PASSWORD}" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$oidc_payload" \
    "$oidc_url" 2>&1)
  
  http_code=$(echo "$response" | tail -1)
  response=$(echo "$response" | sed '$d')
  
  log_info "OIDC Configuration HTTP Status: $http_code"
  
  if [ "$http_code" != "200" ] && [ "$http_code" != "201" ]; then
    log_error "Failed to configure OIDC (HTTP $http_code)"
    return 1
  fi
  
  log_success "OIDC configured for IS application"
  return 0
}

# Get client ID and secret from IS application
get_client_id_from_is() {
  local is_app_id="$1"
  
  log_info "Fetching client ID and secret from IS app: $is_app_id"
  
  local oidc_url="${IS_HOST}/api/server/v1/applications/${is_app_id}/inbound-protocols/oidc"
  
  local response http_code
  response=$(curl -sk -w "\n%{http_code}" -u "${IS_USERNAME}:${IS_PASSWORD}" \
    -H "Accept: application/json" \
    "$oidc_url" 2>/dev/null)
  
  http_code=$(echo "$response" | tail -1)
  response=$(echo "$response" | sed '$d')
  
  if [ "$http_code" != "200" ]; then
    log_error "Failed to get OIDC config (HTTP $http_code)"
    return 1
  fi
  
  local client_id client_secret
  
  if command -v jq &> /dev/null; then
    client_id=$(echo "$response" | jq -r '.clientId' 2>/dev/null)
    client_secret=$(echo "$response" | jq -r '.clientSecret' 2>/dev/null)
  else
    client_id=$(echo "$response" | grep -o '"clientId":"[^"]*"' | head -1 | sed 's/"clientId":"\([^"]*\)"/\1/')
    client_secret=$(echo "$response" | grep -o '"clientSecret":"[^"]*"' | head -1 | sed 's/"clientSecret":"\([^"]*\)"/\1/')
  fi
  
  if [ -n "$client_id" ] && [ "$client_id" != "null" ] && [ -n "$client_secret" ] && [ "$client_secret" != "null" ]; then
    log_success "Retrieved credentials from IS - Client ID: ${client_id:0:10}... Secret: ${client_secret:0:10}..."
    echo "${client_id}|${client_secret}"
    return 0
  fi
  
  log_error "Could not extract client ID or secret"
  log_error "Response: $response"
  return 1
}

# Import OAuth2 credentials as production key in APIM
import_oauth_keys_to_apim() {
  local consumer_key="$1"
  local client_secret="$2"
  local app_id="$3"
  
  log_info "Importing OAuth2 credentials to APIM as production key"
  log_info "Consumer Key: ${consumer_key:0:10}..."
  log_info "App ID: $app_id"
  
  local map_keys_url="${APIM_HOST}/api/am/devportal/v3/applications/${app_id}/map-keys"
  
  local map_keys_payload
  map_keys_payload=$(cat <<EOF
{
  "consumerKey": "${consumer_key}",
  "consumerSecret": "${client_secret}",
  "keyType": "PRODUCTION",
  "keyManager": "${KEY_MANAGER_NAME}"
}
EOF
)
  
  log_info "Map-Keys Endpoint: $map_keys_url"
  log_info "Map-Keys Payload: $(echo "$map_keys_payload" | tr '\n' ' ')"
  
  local response http_code
  response=$(curl -sk -w "\n%{http_code}" -X POST -u "${APIM_USERNAME}:${APIM_PASSWORD}" \
    -H "Content-Type: application/json" \
    -d "$map_keys_payload" \
    "$map_keys_url" 2>&1)
  
  http_code=$(echo "$response" | tail -1)
  response=$(echo "$response" | sed '$d')
  
  log_info "Map-Keys HTTP Status: $http_code"
  log_info "Response: $response"
  
  if [ "$http_code" != "201" ] && [ "$http_code" != "200" ]; then
    log_error "Failed to map keys in APIM (HTTP $http_code)"
    log_error "Response: $response"
    return 1
  fi
  
  log_success "OAuth2 credentials mapped to APIM as production key"
  echo "$consumer_key"
  return 0
}

# Generate keys for the devportal application (via IS OIDC)
generate_app_keys() {
  local app_id="$1"
  
  log_info "Step 1: Register application in Identity Server"
  local is_app_id
  if ! is_app_id=$(register_app_in_is "${APP_NAME}"); then
    log_error "Failed to register app in IS"
    return 1
  fi
  
  log_info "Step 2: Configure OIDC in Identity Server"
  if ! configure_oidc_in_is "$is_app_id"; then
    log_error "Failed to configure OIDC"
    return 1
  fi
  
  # Wait for OIDC config to settle
  sleep 2
  
  log_info "Step 3: Get OAuth2 client credentials from Identity Server"
  local credentials
  if ! credentials=$(get_client_id_from_is "$is_app_id"); then
    log_error "Failed to get client ID from IS"
    return 1
  fi
  
  # Parse credentials (format: client_id|client_secret)
  local consumer_key
  local client_secret
  consumer_key=$(echo "$credentials" | cut -d'|' -f1)
  client_secret=$(echo "$credentials" | cut -d'|' -f2)
  
  if [ -z "$consumer_key" ] || [ -z "$client_secret" ]; then
    log_error "Failed to parse client credentials"
    return 1
  fi
  
  log_info "Step 4: Import OAuth2 credentials to APIM"
  if ! consumer_key=$(import_oauth_keys_to_apim "$consumer_key" "$client_secret" "$app_id"); then
    log_error "Failed to import keys to APIM"
    return 1
  fi
  
  if [ -z "$consumer_key" ]; then
    log_error "Consumer key is empty"
    return 1
  fi
  
  log_success "Generated OAuth2 client ID: $consumer_key"
  echo "$consumer_key"
  return 0
}

# Update frontend environment with devportal app credentials
update_frontend_env() {
  local consumer_key="$1"
  local app_id="$2"
  local env_file="${FRONTEND_ENV_FILE:-/home/wso2/app/.env}"
  
  log_info "Updating frontend environment file with devportal credentials: $env_file"
  
  local env_dir
  env_dir=$(dirname "$env_file")
  
  if [ ! -d "$env_dir" ]; then
    log_info "Creating environment directory: $env_dir"
    mkdir -p "$env_dir" || {
      log_error "Failed to create directory: $env_dir"
      return 1
    }
  fi
  
  cat > "$env_file" <<EOF
# Devportal Application Credentials
# Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
VITE_DEVPORTAL_APP_NAME=${APP_NAME}
VITE_DEVPORTAL_APP_ID=${app_id}
VITE_DEVPORTAL_CONSUMER_KEY=${consumer_key}
VITE_API_MANAGER_HOST=${APIM_HOST}
VITE_AUTH_SIGN_IN_REDIRECT_URL=${FRONTEND_URL}
VITE_AUTH_SIGN_OUT_REDIRECT_URL=${FRONTEND_URL}
VITE_AUTH_CLIENT_ID=${consumer_key}
VITE_AUTH_BASE_URL=${IS_HOST}
VITE_AUTH_SCOPE="openid db_id groups id profile"
EOF
  
  if [ -f "$env_file" ]; then
    log_success "Frontend configuration file saved to: $env_file"
    log_info "Configuration:"
    log_info "  App Name: $APP_NAME"
    log_info "  App ID: $app_id"
    log_info "  Consumer Key: ${consumer_key:0:10}... (truncated)"
    log_info "  API Manager: $APIM_HOST"
    
    return 0
  else
    log_error "Failed to write to environment file"
    return 1
  fi
}

# ==================== MAIN EXECUTION ====================

main() {
  log_info "Starting Devportal Application Registration..."
  
  if [ -z "$APIM_HOST" ]; then
    log_error "APIM_HOST not set"
    exit 1
  fi
  
  log_info "Configuration:"
  log_info "  API Manager: $APIM_HOST"
  log_info "  Application Name: $APP_NAME"
  log_info "  Application Tier: $APP_TIER"
  log_info "  Key Manager: $KEY_MANAGER_NAME"
  log_info "  Callback URL: $FRONTEND_CALLBACK"
  
  wait_for_apim || exit 1
  
  log_info ""
  log_info "========================================="
  log_info "Step 1: Creating Devportal Application"
  log_info "========================================="
  local app_id
  if ! app_id=$(register_application); then
    log_error "Failed to register application"
    exit 1
  fi
  log_success "New Application Created!"
  log_success "Application ID: $app_id"
  log_success "Application Name: $APP_NAME"
  
  log_info "Verifying application..."
  local verify_response
  verify_response=$(curl -sk -u "${APIM_USERNAME}:${APIM_PASSWORD}" \
    "${APIM_HOST}/api/am/devportal/v3/applications/${app_id}" 2>/dev/null)
  log_info "Application Verification Response: $verify_response"
  
  log_info ""
  log_info "========================================="
  log_info "Step 2: Subscribing Application to All APIs"
  log_info "========================================="
  log_info "Using Application ID: $app_id"
  subscribe_to_all_apis "$app_id" "$APP_TIER" || {
    log_warn "API subscription completed with errors (continuing to key generation)"
  }
  
  log_info ""
  log_info "========================================="
  log_info "Step 3: Generating Keys via ${KEY_MANAGER_NAME}"
  log_info "========================================="
  local consumer_key
  if ! consumer_key=$(generate_app_keys "$app_id"); then
    log_error "Failed to generate keys"
    exit 1
  fi
  
  log_info ""
  log_success "========================================="
  log_success "Devportal Application Registration Completed!"
  log_success "========================================="
  log_info "Application: $APP_NAME"
  log_info "Application ID: $app_id"
  log_info "Consumer Key: $consumer_key"
  
  log_info ""
  log_info "========================================="
  log_info "Step 4: Updating Frontend Configuration"
  log_info "========================================="
  update_frontend_env "$consumer_key" "$app_id" || {
    log_warn "Failed to update frontend env (credentials may need manual configuration)"
  }
  
  echo "$consumer_key"
  
  return 0
}

case "${1:-}" in
  show)
    log_info "Devportal App Registration Script"
    log_info "Usage: $0"
    log_info "Environment Variables:"
    log_info "  APIM_HOST: API Manager host (default: https://localhost:9446)"
    log_info "  APIM_USERNAME: API Manager username (default: admin)"
    log_info "  APIM_PASSWORD: API Manager password (default: admin)"
    log_info "  APP_NAME: Application name (default: InsuranceFrontendApp)"
    log_info "  APP_DESC: Application description (default: Insurance Frontend SPA)"
    log_info "  APP_TIER: Subscription tier (default: Unlimited)"
    log_info "  KEY_MANAGER_NAME: Key Manager name (default: WSO2IS72)"
    log_info "  FRONTEND_URL: Frontend URL (default: http://localhost:5173)"
    log_info "  FRONTEND_CALLBACK: OAuth callback URL (default: ${FRONTEND_URL}/callback)"
    ;;
  *)
    main "$@"
    ;;
esac
