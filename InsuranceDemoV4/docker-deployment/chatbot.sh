set -e

CLAIMS_MCP_URL="https://localhost:8246/claims-mcp/1.0.0/mcp"
POLICIES_MCP_URL="https://localhost:8246/policies-mcp/1.0.0/mcp"
PROXY_HEALTH_URL="http://localhost:9097/health"
PROXY_DIR="/home/wso2/BI/proxy"
CHATBOT_DIR="/home/wso2/BI/chatbot"

wait_for_http() {
    local name="$1"
    local url="$2"
    local insecure="$3"
    echo "Checking ${name} at ${url}..."
    while true; do
        status=$(curl -s ${insecure} -o /dev/null -w "%{http_code}" --max-time 5 "$url" || echo "000")
        if [ "$status" != "000" ]; then
            echo "${name} is reachable (HTTP ${status})."
            break
        fi
        echo "${name} not reachable yet. Retrying in 10s..."
        sleep 10
    done
}

wait_for_http "Claims MCP" "$CLAIMS_MCP_URL" "-k"
wait_for_http "Policies MCP" "$POLICIES_MCP_URL" "-k"

echo "Starting MCP protocol-version proxy..."
cd "$PROXY_DIR"
java -jar mcp_proxy.jar &
PROXY_PID=$!

wait_for_http "MCP proxy" "$PROXY_HEALTH_URL" ""

echo "Starting Chatbot Service..."
cd "$CHATBOT_DIR"
BAL_CONFIG_FILES="$CHATBOT_DIR/Config.toml" java -jar chatbot.jar &
CHATBOT_PID=$!

wait "$PROXY_PID" "$CHATBOT_PID"