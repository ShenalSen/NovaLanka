import ballerina/ai;
import ballerina/http;

listener ai:Listener chatAgentListener = new (listenOn = check http:getDefaultListener());

service /customerSupportInsuranceAssistant on chatAgentListener {
    resource function post chat(@http:Payload ai:ChatReqMessage request) returns ai:ChatRespMessage|error {
        string stringResult = check customerSupportInsuranceAssistantAgent.run(request.message, request.sessionId);
        return {message: stringResult};
    }
}
