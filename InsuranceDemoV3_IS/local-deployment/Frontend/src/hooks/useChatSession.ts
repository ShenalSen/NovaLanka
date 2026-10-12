import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { sendChatMessage } from '../lib/api/chatApi';
import { useErrorHandler } from './useErrorHandler';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessageT {
  id: string;
  role: ChatRole;
  content: string;
  ts: number;
}

const SESSION_KEY = 'chatSessionId';

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getOrCreateSessionId = (): string => {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = generateId();
    sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return generateId();
  }
};

export const useChatSession = () => {
  const [messages, setMessages] = useState<ChatMessageT[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());
  const abortRef = useRef<AbortController | null>(null);
  const { getErrorMessage } = useErrorHandler();

  // Abort any pending request on unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      setError(null);
      const userMsg: ChatMessageT = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsSending(true);

      // Abort any previous in-flight request before starting a new one
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const { data } = await sendChatMessage(
          { message: trimmed, sessionId },
          abortRef.current.signal,
        );
        const reply =
          data?.reply ??
          data?.error ??
          'Sorry, I could not generate a response.';
        const assistantMsg: ChatMessageT = {
          id: generateId(),
          role: 'assistant',
          content: reply,
          ts: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        // Ignore aborts (component unmount or follow-up send)
        if (axios.isCancel(err)) return;
        if (err instanceof Error && err.name === 'CanceledError') return;
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(getErrorMessage(err));
      } finally {
        setIsSending(false);
      }
    },
    [isSending, sessionId, getErrorMessage],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsSending(false);
  }, []);

  const clear = useCallback(() => {
    abort();
    setMessages([]);
    setError(null);
    const fresh = generateId();
    try {
      sessionStorage.setItem(SESSION_KEY, fresh);
    } catch {
      /* ignore */
    }
    setSessionId(fresh);
  }, [abort]);

  return {
    messages,
    isSending,
    error,
    sessionId,
    send,
    abort,
    clear,
  };
};
