#!/bin/bash
# Dynamically set JAVA_HOME and update PATH at runtime
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
export PATH="$JAVA_HOME/bin:$PATH"
set -e

echo "Starting MySQL..."
service mysql start

echo "Initializing DB..."
/home/wso2/init_db.sh

echo "Starting Micro Integrator..."
/home/wso2/start_services.sh

