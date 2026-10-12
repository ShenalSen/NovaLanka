#!/bin/bash

# Start MySQL database
echo "Starting MySQL Service..."
service mysql start

# Wait for MySQL to be ready
until mysqladmin ping --silent; do
    echo "Waiting for MySQL to start..."
    sleep 2
done
echo "MySQL is up and running."

echo "Starting WSO2 API Manager..."
/home/wso2carbon/wso2am/bin/api-manager.sh &

# Define locations
APIM_HOME="/home/wso2carbon/wso2am"
MI_HOME="/home/wso2carbon/wso2mi"
APIM_LOG_FILE="$APIM_HOME/repository/logs/wso2carbon.log"
MI_CONFIG="$MI_HOME/conf/deployment.toml"

# Wait for APIM to generate its keystores and be ready
echo "Waiting for WSO2 API Manager to start..."
while true; do
    if [ -f "$APIM_LOG_FILE" ] && grep -q "Mgt Console URL" "$APIM_LOG_FILE"; then
        break
    fi
    echo "Waiting for APIM to fully initialize..."
    sleep 5
done

echo "WSO2 API Manager has fully started."

# --- Certificate Sync Section ---
echo "Synchronizing certificates between APIM and MI..."
CERT_FILE="/tmp/wso2apim.crt"

# Export public cert from APIM
keytool -export -alias wso2carbon \
    -keystore "$APIM_HOME/repository/resources/security/wso2carbon.jks" \
    -storepass wso2carbon -file "$CERT_FILE"

# Import into MI Truststore (removes existing alias first to avoid 'already exists' error)
keytool -delete -alias wso2apim \
    -keystore "$MI_HOME/repository/resources/security/client-truststore.jks" \
    -storepass wso2carbon -noprompt || true

keytool -import -trustcacerts -alias wso2apim -file "$CERT_FILE" \
    -keystore "$MI_HOME/repository/resources/security/client-truststore.jks" \
    -storepass wso2carbon -noprompt

echo "Certificate synchronization complete."
# -------------------------------------

# Update the API Manager configuration
echo "Updating API Manager configuration..."
WEB_XML="/home/wso2carbon/wso2am/repository/deployment/server/webapps/oauth2/WEB-INF/web.xml"

CORS_FILTER='  <filter>
    <filter-name>CORS</filter-name>
    <filter-class>com.thetransactioncompany.cors.CORSFilter</filter-class>
    <init-param>
      <param-name>cors.allowOrigin</param-name>
      <param-value>*</param-value>
    </init-param>
    <init-param>
      <param-name>cors.supportedMethods</param-name>
      <param-value>GET, POST, HEAD, PUT, DELETE, OPTIONS</param-value>
    </init-param>
  </filter>
  <filter-mapping>
    <filter-name>CORS</filter-name>
    <url-pattern>*</url-pattern>
  </filter-mapping>
'

if ! grep -q 'com.thetransactioncompany.cors.CORSFilter' "$WEB_XML"; then
  awk -v block="$CORS_FILTER" '
    /<\/filter-mapping>/ { last=NR }
    { lines[NR] = $0 }
    END {
      for (i=1; i<=NR; ++i) {
        print lines[i]
        if (i == last) print block
      }
    }
  ' "$WEB_XML" > "${WEB_XML}.tmp" && mv "${WEB_XML}.tmp" "$WEB_XML"
  echo "CORS filter block added after last </filter-mapping> in web.xml"
else
  echo "CORS filter block already exists in web.xml, skipping insertion."
fi


# Check if the insurance database exists and is ready before starting MI
echo "Verifying database status..."
DB_EXISTS=$(mysql -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -e "SHOW DATABASES LIKE '${MYSQL_DATABASE}';" | grep "${MYSQL_DATABASE}")
if [ -z "$DB_EXISTS" ]; then
    echo "ERROR: Database ${MYSQL_DATABASE} does not exist! WSO2 MI will not be started."
    exit 1
fi

# Check if we can connect and if essential tables exist
echo "Verifying database connectivity and tables..."
if ! mysql -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" "${MYSQL_DATABASE}" -e "SELECT 1" > /dev/null 2>&1; then
    echo "ERROR: Cannot connect to database ${MYSQL_DATABASE}!"
    exit 1
fi

# Wait a bit more to ensure APIM and DB are fully ready
echo "Database ${MYSQL_DATABASE} exists and is accessible. Waiting for final checks..."
sleep 5
echo "All checks passed. Proceeding to start WSO2 services."

echo "Starting Micro Integrator..."
# Limit Java heap size to help prevent OOM kills
export JAVA_OPTS="-Xms256m -Xmx1024m"
# Start MI with externalized email configuration
/home/wso2carbon/wso2mi/bin/micro-integrator.sh --env-file=/home/wso2/missedCallsHandler.env &

# Start the frontend in parallel
cd /home/wso2/app
npm run dev -- --host 0.0.0.0 --port 5173 &
cd -

# Wait for both background processes
wait
