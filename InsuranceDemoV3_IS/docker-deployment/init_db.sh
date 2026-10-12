#!/bin/bash

# Wait for MySQL to be ready
until mysqladmin ping -h "localhost" --silent; do
    echo "Waiting for MySQL to start..."
    sleep 2
done


# Ensure root user can log in with password (set to mysql_native_password)
echo "Configuring MySQL root user authentication..."
mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};
EOF

# Check if database was created
DB_EXISTS=$(mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "SHOW DATABASES LIKE '${MYSQL_DATABASE}';" | grep "${MYSQL_DATABASE}")
if [ -z "$DB_EXISTS" ]; then
    echo "ERROR: Database ${MYSQL_DATABASE} was not created! Exiting."
    exit 1
else
    echo "Database ${MYSQL_DATABASE} exists."
fi

# Execute schema files
for schema_file in /app/schemas/*.sql; do
    echo "Executing schema file: $schema_file"
    mysql -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" < "$schema_file"
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to execute $schema_file"
        exit 1
    fi
done

echo "Database initialization complete."

# Print tables in the insurance database for verification
echo "Tables in database '${MYSQL_DATABASE}':"
mysql -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -e "SHOW TABLES;" "${MYSQL_DATABASE}"