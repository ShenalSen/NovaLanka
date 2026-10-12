import { createApiClient } from './apiClient';

const apiClient = createApiClient('/chatbotapi/1.0.0', 60000);

export type ChatRequest = {
  message: string;
  sessionId: string;
};

export type ChatResponse = {
  reply: string;
  toolCalls?: string[];
  error?: string;
};

// Shape returned by the MI ai.agent mediator
type AgentResponse = {
  content?: string;
  message?: string;
  finishReason?: string;
  tokenUsage?: {
    inputTokenCount?: number;
    outputTokenCount?: number;
    totalTokenCount?: number;
  };
  toolExecutions?: Array<{
    request?: { id?: string; name?: string; arguments?: string };
    result?: string;
  }>;
  error?: string;
};

export const sendChatMessage = async (
  payload: ChatRequest,
  signal?: AbortSignal,
): Promise<{ data: ChatResponse }> => {
  const body = {
    sessionId: payload.sessionId,
    message: payload.message,
  };

  const { data } = await apiClient.post<AgentResponse>('', body, { signal });

  // The agent response may contain a content field, a message field, or an error field;
  // prioritize content, then message, then error.
  const reply =
    data?.content?.trim() ?? data?.message?.trim() ?? data?.error ??
    'Sorry, I could not generate a response.';

  const toolCalls = data?.toolExecutions
    ?.map((t) => t.request?.name)
    .filter((n): n is string => !!n);

  return { data: { reply, toolCalls } };
};
