import ballerinax/ai.mistral;

final AiMcptoolkitClaims aiMcptoolkitClaims = check new ("http://localhost:9097/claimsmcp");
final AiMcptoolkitPolicies aiMcptoolkitPolicies = check new ("http://localhost:9097/policiesmcp");
final mistral:ModelProvider mistralModelprovider = check new (string `${mistralAikey}`, "mistral-small-latest", maxTokens = 4096, secureSocket = {enable: false});
