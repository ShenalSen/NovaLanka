#!/bin/bash
# Database Setup Script
# Initializes the MySQL database with schema

set -e

# Configuration
MYSQL_HOST=${MYSQL_HOST:-mysql}
MYSQL_PORT=${MYSQL_PORT:-3306}
MYSQL_DATABASE=${MYSQL_DATABASE:-insurance}
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-12345}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
  echo -e "${BLUE}ℹ️  [SETUP-DB] $*${NC}"
}

log_success() {
  echo -e "${GREEN}✅ [SETUP-DB] $*${NC}"
}

log_error() {
  echo -e "${RED}❌ [SETUP-DB] $*${NC}"
}

log_warn() {
  echo -e "${YELLOW}⚠️  [SETUP-DB] $*${NC}"
}

# Check if database exists
check_database_exists() {
  local result
  result=$(mysql -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" -u root -p"${MYSQL_ROOT_PASSWORD}" \
    -e "SHOW DATABASES LIKE '${MYSQL_DATABASE}';" 2>/dev/null | grep "${MYSQL_DATABASE}" || true)
  
  if [ -n "$result" ]; then
    return 0
  else
    return 1
  fi
}

# Check if tables already exist
check_tables_exist() {
  local table_count
  table_count=$(mysql -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" -u root -p"${MYSQL_ROOT_PASSWORD}" \
    -D "${MYSQL_DATABASE}" \
    -se "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${MYSQL_DATABASE}';" 2>/dev/null || echo "0")
  
  if [ "$table_count" -gt 0 ]; then
    return 0
  else
    return 1
  fi
}

# Initialize database schema
initialize_schema() {
  log_info "Executing database schema files..."
  
  local schema_dir="/app/schemas"
  if [ ! -d "$schema_dir" ]; then
    log_warn "Schema directory not found: $schema_dir"
    return 0
  fi
  
  local schema_count=0
  for schema_file in "$schema_dir"/*.sql; do
    if [ ! -f "$schema_file" ]; then
      continue
    fi
    
    schema_count=$((schema_count + 1))
    log_info "Executing schema: $(basename "$schema_file")"
    
    if ! mysql -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" -u root -p"${MYSQL_ROOT_PASSWORD}" \
         "${MYSQL_DATABASE}" < "$schema_file"; then
      log_error "Failed to execute schema: $(basename "$schema_file")"
      return 1
    fi
  done
  
  if [ $schema_count -eq 0 ]; then
    log_warn "No schema files found in $schema_dir"
  else
    log_success "Executed $schema_count schema file(s)"
  fi
  
  return 0
}

# Verify database initialization
verify_database() {
  log_info "Verifying database initialization..."
  
  local table_list
  table_list=$(mysql -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" -u root -p"${MYSQL_ROOT_PASSWORD}" \
    -D "${MYSQL_DATABASE}" -e "SHOW TABLES;" 2>/dev/null || echo "")
  
  if [ -z "$table_list" ]; then
    log_warn "No tables found in database '${MYSQL_DATABASE}'"
  else
    log_success "Database verification successful"
    log_info "Tables in database '${MYSQL_DATABASE}':"
    echo "$table_list" | sed 's/^/  /'
  fi
}

# Main execution
main() {
  log_info "=== Setting up Database ==="
  
  if ! check_database_exists; then
    log_error "Database '${MYSQL_DATABASE}' does not exist"
    exit 1
  fi
  
  log_success "Database '${MYSQL_DATABASE}' exists"
  
  if check_tables_exist; then
    log_warn "Database already initialized with existing tables"
    verify_database
    return 0
  fi
  
  initialize_schema || {
    log_error "Database schema initialization failed"
    exit 1
  }
  
  verify_database || {
    log_error "Database verification failed"
    exit 1
  }
  
  log_success "Database setup completed"
  return 0
}

main "$@"
