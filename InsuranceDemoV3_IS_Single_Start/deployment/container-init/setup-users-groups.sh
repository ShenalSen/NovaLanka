#!/bin/bash
# Setup Users and Groups Script
# Creates users and groups via SCIM2 API and assigns group memberships
# Idempotent - safe to re-run
# Note: Compatible with bash 3.2+ (macOS) - no associative arrays

# Don't use 'set -e' - we want to handle errors individually


# ==================== CONFIGURATION ====================

IS_HOST=${IS_HOST:-https://localhost:9443}
IS_USERNAME=${IS_USERNAME:-admin}
IS_PASSWORD=${IS_PASSWORD:-admin}
MAX_RETRY=30
RETRY_INTERVAL=10

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
  echo -e "${BLUE}ℹ️  [SETUP-USERS] $*${NC}" >&2
}

log_success() {
  echo -e "${GREEN}✅ [SETUP-USERS] $*${NC}" >&2
}

log_error() {
  echo -e "${RED}❌ [SETUP-USERS] $*${NC}" >&2
}

log_warn() {
  echo -e "${YELLOW}⚠️  [SETUP-USERS] $*${NC}" >&2
}

# ==================== UTILITY FUNCTIONS ====================

# Wait for Identity Server to be ready
wait_for_is() {
  local retry_count=0
  local scim_url="${IS_HOST}/scim2/Users"
  
  log_info "Waiting for Identity Server SCIM2 API to be ready..."
  
  while [ $retry_count -lt $MAX_RETRY ]; do
    if curl -sk -u "${IS_USERNAME}:${IS_PASSWORD}" \
         -H "Accept: application/json" \
         "$scim_url" > /dev/null 2>&1; then
      log_success "Identity Server SCIM2 API is ready"
      return 0
    fi
    retry_count=$((retry_count + 1))
    log_info "Attempt $retry_count/$MAX_RETRY - Waiting for IS SCIM2 API..."
    sleep $RETRY_INTERVAL
  done
  
  log_error "Identity Server SCIM2 API did not become ready in time"
  return 1
}

# Check if user exists by username
check_user_exists() {
  local username="$1"
  local filter="userName eq \"${username}\""
  local encoded_filter=$(echo "$filter" | sed 's/ /%20/g' | sed 's/"/%22/g')
  
  local response
  response=$(curl -sk -u "${IS_USERNAME}:${IS_PASSWORD}" \
    -H "Accept: application/json" \
    "${IS_HOST}/scim2/Users?filter=${encoded_filter}" 2>/dev/null)
  
  if echo "$response" | grep -q "\"userName\":\"${username}\""; then
    # Extract user ID
    local user_id
    user_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"\([^"]*\)"/\1/')
    log_info "User already exists: $username (ID: $user_id)"
    echo "$user_id"
    return 0
  else
    log_info "User does not exist: $username"
    return 1
  fi
}

# Check if group exists by displayName
check_group_exists() {
  local groupname="$1"
  local filter="displayName eq \"${groupname}\""
  local encoded_filter=$(echo "$filter" | sed 's/ /%20/g' | sed 's/"/%22/g')
  
  local response
  response=$(curl -sk -u "${IS_USERNAME}:${IS_PASSWORD}" \
    -H "Accept: application/json" \
    "${IS_HOST}/scim2/Groups?filter=${encoded_filter}" 2>/dev/null)
  
  if echo "$response" | grep -q "\"displayName\":\"${groupname}\""; then
    # Extract group ID
    local group_id
    group_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"\([^"]*\)"/\1/')
    log_info "Group already exists: $groupname (ID: $group_id)"
    echo "$group_id"
    return 0
  else
    log_info "Group does not exist: $groupname"
    return 1
  fi
}

# ==================== USER CREATION ====================

# Create user via SCIM2 API (without enterprise extension)
create_user() {
  local username="$1"
  local given_name="$2"
  local family_name="$3"
  local password="$4"
  local email="$5"
  
  log_info "Creating user: $username"
  
  local user_payload=$(cat <<EOF
{
  "schemas": [
    "urn:ietf:params:scim:schemas:core:2.0:User"
  ],
  "name": {
    "givenName": "${given_name}",
    "familyName": "${family_name}"
  },
  "userName": "${username}",
  "password": "${password}",
  "emails": [
    {
      "value": "${email}",
      "primary": true
    }
  ]
}
EOF
)
  
  local response http_code
  response=$(curl -sk -w "\n%{http_code}" -X POST \
    -u "${IS_USERNAME}:${IS_PASSWORD}" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$user_payload" \
    "${IS_HOST}/scim2/Users" 2>&1)
  
  http_code=$(echo "$response" | tail -n1)
  response=$(echo "$response" | sed '$d')
  
  if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    local user_id
    user_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"\([^"]*\)"/\1/')
    log_success "User created successfully: $username (ID: $user_id)"
    echo "$user_id"
    return 0
  else
    log_error "Failed to create user: $username (HTTP $http_code)"
    log_error "Response: $response"
    return 1
  fi
}

# ==================== GROUP CREATION ====================

# Create group via SCIM2 API
create_group() {
  local groupname="$1"
  
  log_info "Creating group: $groupname"
  
  local group_payload=$(cat <<EOF
{
  "schemas": [
    "urn:ietf:params:scim:schemas:core:2.0:Group"
  ],
  "displayName": "${groupname}"
}
EOF
)
  
  local response http_code
  response=$(curl -sk -w "\n%{http_code}" -X POST \
    -u "${IS_USERNAME}:${IS_PASSWORD}" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$group_payload" \
    "${IS_HOST}/scim2/Groups" 2>&1)
  
  http_code=$(echo "$response" | tail -n1)
  response=$(echo "$response" | sed '$d')
  
  if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    local group_id
    group_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"\([^"]*\)"/\1/')
    log_success "Group created successfully: $groupname (ID: $group_id)"
    echo "$group_id"
    return 0
  else
    log_error "Failed to create group: $groupname (HTTP $http_code)"
    log_error "Response: $response"
    return 1
  fi
}

# ==================== GROUP MEMBERSHIP ====================

# Add user to group via SCIM2 API (PATCH)
add_user_to_group() {
  local group_id="$1"
  local user_id="$2"
  local username="$3"
  local groupname="$4"
  
  log_info "Adding user '$username' (ID: $user_id) to group '$groupname' (ID: $group_id)" >&2
  
  # Build new members array with just this member
  local new_members
  new_members=$(cat <<EOF
[
  {
    "value": "${user_id}",
    "display": "${username}"
  }
]
EOF
)
  
  # Try PATCH with add operation first
  log_info "Attempting PATCH with add operation..." >&2
  
  # Construct PATCH payload
  local patch_payload=$(cat <<EOF
{
  "schemas": [
    "urn:ietf:params:scim:api:messages:2.0:PatchOp"
  ],
  "Operations": [
    {
      "op": "add",
      "path": "members",
      "value": ${new_members}
    }
  ]
}
EOF
)
  
#   log_info "PATCH URL: ${IS_HOST}/scim2/Groups/${group_id}" >&2
#   log_info "PATCH Payload:" >&2
#   echo "$patch_payload" | sed 's/^/  /' >&2
  
  local response http_code full_response
  full_response=$(curl -sk -w "\n%{http_code}" -X PATCH \
    -u "${IS_USERNAME}:${IS_PASSWORD}" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$patch_payload" \
    "${IS_HOST}/scim2/Groups/${group_id}" 2>&1) || {
    log_error "Curl command failed during PATCH add" >&2
    return 0
  }
  
  http_code=$(echo "$full_response" | tail -n1)
  response=$(echo "$full_response" | sed '$d')
  
#   log_info "PATCH Response Code: $http_code" >&2
#   if [ -n "$response" ]; then
#     log_info "PATCH Response Body:" >&2
#     echo "$response" | sed 's/^/  /' >&2
#   fi
  
  if [ "$http_code" = "200" ] || [ "$http_code" = "201" ] || [ "$http_code" = "204" ]; then
    log_success "✅ User '$username' successfully added to group '$groupname'" >&2
    return 0
  fi
  
  # If add fails, try replace operation
  log_warn "PATCH add operation failed (HTTP $http_code), trying replace..." >&2
  
  local replace_payload=$(cat <<EOF
{
  "schemas": [
    "urn:ietf:params:scim:api:messages:2.0:PatchOp"
  ],
  "Operations": [
    {
      "op": "replace",
      "path": "members",
      "value": ${new_members}
    }
  ]
}
EOF
)
  
  log_info "Attempting PATCH with replace operation..." >&2
  local replace_response replace_code full_replace
  full_replace=$(curl -sk -w "\n%{http_code}" -X PATCH \
    -u "${IS_USERNAME}:${IS_PASSWORD}" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$replace_payload" \
    "${IS_HOST}/scim2/Groups/${group_id}" 2>&1) || {
    log_error "Curl command failed during PATCH replace" >&2
    return 0
  }
  
  replace_code=$(echo "$full_replace" | tail -n1)
  replace_response=$(echo "$full_replace" | sed '$d')
  
#   log_info "PATCH (replace) Response Code: $replace_code" >&2
#   if [ -n "$replace_response" ]; then
#     log_info "PATCH (replace) Response Body:" >&2
#     echo "$replace_response" | sed 's/^/  /' >&2
#   fi
  
  if [ "$replace_code" = "200" ] || [ "$replace_code" = "201" ] || [ "$replace_code" = "204" ]; then
    log_success "✅ User '$username' added to group '$groupname' (via replace)" >&2
    return 0
  fi
  
  log_error "❌ Failed to add user '$username' to group '$groupname'" >&2
  log_error "ADD operation: HTTP $http_code" >&2
  log_error "REPLACE operation: HTTP $replace_code" >&2
  return 0  # Don't fail - continue with next user
}

# ==================== MAIN ORCHESTRATION ====================

main() {
  log_info "=== Setting up Users and Groups ==="
  
  # Wait for IS to be ready
  wait_for_is || {
    log_error "Identity Server not ready"
    exit 1
  }
  
  # User data (name:givenName:familyName:password:email)
  local ahmed_data="ahmed:Ahmed:Khalid:aBcd!23#:ahmed@example.com"
  local fatima_data="fatima:Fatima:Zahra:Xyz@456!:fatima@example.com"
  local omar_data="omar:Omar:Haddad:Pass@789#:omar@example.com"
  
  # Groups to create
  local employees_group="Employees"
  local customers_group="Customers"
  
  # User-to-group assignments (will be filled as we create users/groups)
  local ahmed_id="" fatima_id="" omar_id=""
  local employees_id="" customers_id="" admin_id=""
  
  # ==================== CREATE USERS ====================
  
  log_info "Step 1: Creating users..."
  echo ""
  
  # Create ahmed
  IFS=':' read -r username given_name family_name password email <<< "$ahmed_data"
  if user_id=$(check_user_exists "$username"); then
    ahmed_id="$user_id"
  else
    if user_id=$(create_user "$username" "$given_name" "$family_name" "$password" "$email"); then
      ahmed_id="$user_id"
    else
      log_error "Failed to create user: $username"
    fi
  fi
  sleep 1
  
  # Create fatima
  IFS=':' read -r username given_name family_name password email <<< "$fatima_data"
  if user_id=$(check_user_exists "$username"); then
    fatima_id="$user_id"
  else
    if user_id=$(create_user "$username" "$given_name" "$family_name" "$password" "$email"); then
      fatima_id="$user_id"
    else
      log_error "Failed to create user: $username"
    fi
  fi
  sleep 1
  
  # Create omar
  IFS=':' read -r username given_name family_name password email <<< "$omar_data"
  if user_id=$(check_user_exists "$username"); then
    omar_id="$user_id"
  else
    if user_id=$(create_user "$username" "$given_name" "$family_name" "$password" "$email"); then
      omar_id="$user_id"
    else
      log_error "Failed to create user: $username"
    fi
  fi
  sleep 1
  
  echo ""
  log_success "User creation completed"
  
  # ==================== CREATE GROUPS ====================
  
  log_info "Step 2: Creating groups..."
  echo ""
  
  # Create Employees group
  if group_id=$(check_group_exists "$employees_group"); then
    employees_id="$group_id"
  else
    if group_id=$(create_group "$employees_group"); then
      employees_id="$group_id"
    else
      log_error "Failed to create group: $employees_group"
    fi
  fi
  sleep 1
  
  # Create Customers group
  if group_id=$(check_group_exists "$customers_group"); then
    customers_id="$group_id"
  else
    if group_id=$(create_group "$customers_group"); then
      customers_id="$group_id"
    else
      log_error "Failed to create group: $customers_group"
    fi
  fi
  sleep 1
  
  # Get admin group ID
  log_info "Looking up admin group..."
  if group_id=$(check_group_exists "admin"); then
    admin_id="$group_id"
  else
    log_warn "Admin group not found - it should exist by default"
  fi
  
  echo ""
  log_success "Group creation completed"
  
  # ==================== ASSIGN USERS TO GROUPS ====================
  
  log_info "Step 3: Assigning users to groups..."
  echo ""
  
  # Assign ahmed to Employees
  if [ -n "$ahmed_id" ] && [ -n "$employees_id" ]; then
    add_user_to_group "$employees_id" "$ahmed_id" "ahmed" "$employees_group"
    sleep 1
  else
    log_warn "Cannot assign ahmed to $employees_group - missing IDs"
  fi
  
  # Assign fatima to admin
  if [ -n "$fatima_id" ] && [ -n "$admin_id" ]; then
    add_user_to_group "$admin_id" "$fatima_id" "fatima" "admin"
    sleep 1
  else
    log_warn "Cannot assign fatima to admin group - missing IDs"
  fi
  
  # Assign omar to Customers
  if [ -n "$omar_id" ] && [ -n "$customers_id" ]; then
    add_user_to_group "$customers_id" "$omar_id" "omar" "$customers_group"
    sleep 1
  else
    log_warn "Cannot assign omar to $customers_group - missing IDs"
  fi
  
  echo ""
  log_success "User-to-group assignments completed"
  
  # ==================== SUMMARY ====================
  
  echo ""
  log_info "=== Setup Summary ==="
  log_info "Users created/verified:"
  [ -n "$ahmed_id" ] && log_info "  - ahmed (ID: $ahmed_id)"
  [ -n "$fatima_id" ] && log_info "  - fatima (ID: $fatima_id)"
  [ -n "$omar_id" ] && log_info "  - omar (ID: $omar_id)"
  
  echo ""
  log_info "Groups created/verified:"
  [ -n "$employees_id" ] && log_info "  - Employees (ID: $employees_id)"
  [ -n "$customers_id" ] && log_info "  - Customers (ID: $customers_id)"
  [ -n "$admin_id" ] && log_info "  - admin (ID: $admin_id)"
  
  echo ""
  log_success "Users and groups setup completed successfully"
  
  return 0
}

# Execute main function
main "$@"
