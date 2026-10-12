import ballerinax/ai.mistral;

final AiMcptoolkitClaims aiMcptoolkitClaims = check new ("https://localhost:8243/claims-mcp/1.0.0/mcp", secureSocket = {enable: false});
final AiMcptoolkitPolicies aiMcptoolkitPolicies = check new ("https://localhost:8243/policies-mcp/1.0.0/mcp", secureSocket = {enable: false});
final mistral:ModelProvider mistralModelprovider = check new (string `${mistralAikey}`, "mistral-small-latest", maxTokens = 4096, secureSocket = {enable: false});
