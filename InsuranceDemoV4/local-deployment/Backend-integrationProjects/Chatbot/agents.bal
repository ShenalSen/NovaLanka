import ballerina/ai;
import ballerina/mcp;

final ai:Agent customerSupportInsuranceAssistantAgent = check new (
    systemPrompt = {role: string `Customer Support Insurance Assistant`, instructions: string `${modelinstructions}`}, memory = aiShorttermmemory, model = mistralModelprovider, tools = [aiMcptoolkitClaims, aiMcptoolkitPolicies]
);

isolated class AiMcptoolkitClaims {
    *ai:McpBaseToolKit;
    private final mcp:StreamableHttpClient mcpClient;
    private final readonly & ai:ToolConfig[] tools;

    // Initialize the MCP toolkit for claims with the provided server URL, implementation info, and transport configuration.
    public isolated function init(string serverUrl, mcp:Implementation info = {name: "MCP", version: "1.0.0"},
            *mcp:StreamableHttpClientTransportConfig config) returns ai:Error? {
        final map<ai:FunctionTool> permittedTools = {
            "get_claims_customer_by_id": self.get_claims_customer_by_id,
            "get_claims": self.get_claims,
            "get_claim_by_id": self.get_claim_by_id
        };

        do {
            self.mcpClient = check new mcp:StreamableHttpClient(serverUrl, config);
            self.tools = check ai:getPermittedMcpToolConfigs(self.mcpClient, info, permittedTools).cloneReadOnly();
        } on fail error e {
            return error ai:Error("Failed to initialize MCP toolkit", e);
        }
    }

    public isolated function getTools() returns ai:ToolConfig[] => self.tools;

    @ai:AgentTool
    public isolated function get_claims_customer_by_id(mcp:CallToolParams params) returns mcp:CallToolResult|error {
        return self.mcpClient->callTool(params);
    }

    @ai:AgentTool
    public isolated function get_claims(mcp:CallToolParams params) returns mcp:CallToolResult|error {
        return self.mcpClient->callTool(params);
    }

    @ai:AgentTool
    public isolated function get_claim_by_id(mcp:CallToolParams params) returns mcp:CallToolResult|error {
        return self.mcpClient->callTool(params);
    }
}

isolated class AiMcptoolkitPolicies {
    *ai:McpBaseToolKit;
    private final mcp:StreamableHttpClient mcpClient;
    private final readonly & ai:ToolConfig[] tools;

    // Initialize the MCP toolkit for policies with the provided server URL, implementation info, and transport configuration.
    public isolated function init(string serverUrl, mcp:Implementation info = {name: "MCP", version: "1.0.0"},
            *mcp:StreamableHttpClientTransportConfig config) returns ai:Error? {
        final map<ai:FunctionTool> permittedTools = {
            "get_policies_customer_by_customer_id": self.get_policies_customer_by_customer_id,
            "get_policy_by_id": self.get_policy_by_id,
            "get_policies": self.get_policies
        };

        do {
            self.mcpClient = check new mcp:StreamableHttpClient(serverUrl, config);
            self.tools = check ai:getPermittedMcpToolConfigs(self.mcpClient, info, permittedTools).cloneReadOnly();
        } on fail error e {
            return error ai:Error("Failed to initialize MCP toolkit", e);
        }
    }

    public isolated function getTools() returns ai:ToolConfig[] => self.tools;

    @ai:AgentTool
    public isolated function get_policies_customer_by_customer_id(mcp:CallToolParams params) returns mcp:CallToolResult|error {
        return self.mcpClient->callTool(params);
    }

    @ai:AgentTool
    public isolated function get_policy_by_id(mcp:CallToolParams params) returns mcp:CallToolResult|error {
        return self.mcpClient->callTool(params);
    }

    @ai:AgentTool
    public isolated function get_policies(mcp:CallToolParams params) returns mcp:CallToolResult|error {
        return self.mcpClient->callTool(params);
    }
}

final ai:ShortTermMemory aiShorttermmemory = check new (aiInmemoryshorttermmemorystore);
final ai:InMemoryShortTermMemoryStore aiInmemoryshorttermmemorystore = check new ();
