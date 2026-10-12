import ballerina/http;

// This proxy exists solely to rewrite the MCP "protocolVersion" in "initialize" requests
// because WSO2 APIM and the Ballerina MCP client currently negotiate different versions.
// Once that mismatch is resolved upstream, this entire proxy can be deleted.
const string NEGOTIATED_PROTOCOL_VERSION = "2025-06-18";

// LOCAL-DEMO ONLY: TLS verification is disabled because the APIM gateway uses a self-signed
// certificate in the local Docker deployment. Remove the `secureSocket = {enable: false}`
// overrides and supply a trusted cert before deploying to any non-local environment.
final http:Client claimsMcpUpstream = check new ("https://localhost:8246/claims-mcp/1.0.0/mcp", secureSocket = {enable: false});
final http:Client policiesMcpUpstream = check new ("https://localhost:8246/policies-mcp/1.0.0/mcp", secureSocket = {enable: false});

listener http:Listener mcpProxyListener = new (9097);

// This function rewrites the protocolVersion in the payload of an "initialize" method call to the negotiated protocol version.
isolated function rewriteInitializeProtocolVersion(json payload) returns json {
    if payload is map<json> && payload["method"] == "initialize" {
        json paramsJson = payload["params"];
        if paramsJson is map<json> {
            map<json> updatedParams = paramsJson.clone();
            updatedParams["protocolVersion"] = NEGOTIATED_PROTOCOL_VERSION;
            map<json> updatedPayload = payload.clone();
            updatedPayload["params"] = updatedParams;
            return updatedPayload;
        }
    }
    return payload;
}

// This function extracts the headers that need to be passed through to the upstream MCP service.
isolated function extractPassthroughHeaders(http:Request req) returns map<string|string[]> {
    map<string|string[]> headers = {};
    foreach string name in ["content-type", "accept", "mcp-session-id", "mcp-protocol-version"] {
        string|http:HeaderNotFoundError value = req.getHeader(name);
        if value is string {
            headers[name] = value;
        }
    }
    return headers;
}

// The following services act as proxies for the claims and policies MCP services, rewriting the protocol version in "initialize" requests and passing through relevant headers.
service /claimsmcp on mcpProxyListener {
    resource function post .(http:Request req) returns http:Response|error {
        json payload = check req.getJsonPayload();
        return claimsMcpUpstream->post("", rewriteInitializeProtocolVersion(payload), headers = extractPassthroughHeaders(req));
    }
}

service /policiesmcp on mcpProxyListener {
    resource function post .(http:Request req) returns http:Response|error {
        json payload = check req.getJsonPayload();
        return policiesMcpUpstream->post("", rewriteInitializeProtocolVersion(payload), headers = extractPassthroughHeaders(req));
    }
}

// This service provides a simple health check endpoint for the proxy.
service /health on mcpProxyListener {
    resource function get .() returns string {
        return "ok";
    }
}
