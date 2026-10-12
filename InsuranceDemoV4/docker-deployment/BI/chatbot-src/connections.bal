import ballerinax/ai.mistral;

final AiMcptoolkitClaims aiMcptoolkitClaims = check new ("http://localhost:9097/claimsmcp");
final AiMcptoolkitPolicies aiMcptoolkitPolicies = check new ("http://localhost:9097/policiesmcp");
// LOCAL-DEMO ONLY: TLS verification is disabled to avoid cert validation issues in the local deployment.
// Remove `secureSocket = {enable: false}` before any non-local deployment.
final mistral:ModelProvider mistralModelprovider = check new (string `${mistralAikey}`, "mistral-small-latest", maxTokens = 4096, secureSocket = {enable: false});