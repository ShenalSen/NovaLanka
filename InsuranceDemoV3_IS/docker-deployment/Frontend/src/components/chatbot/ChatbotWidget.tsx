import React, { useEffect, useRef, useState } from 'react';
import {
  FloatingButton,
  ChatPanel,
  PanelHeader,
  PanelTitle,
  HeaderActions,
  IconButton,
  CloseButton,
  MessagesScroll,
  EmptyState,
  ErrorBanner,
  InputRow,
  TextArea,
  SendButton,
} from '../../styles/customer/Chatbot.styled';
import { ChatIcon } from '../icons/ChatIcon';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { useChatSession } from '../../hooks/useChatSession';

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const { messages, isSending, error, send, clear, abort } = useChatSession();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to the latest message when messages change or while typing
  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isSending, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) textAreaRef.current?.focus();
  }, [isOpen]);

  // Esc closes the panel
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || isSending) return;
    void send(draft);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter inserts newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) {
    return (
      <FloatingButton
        type="button"
        aria-label="Open chat assistant"
        title="Ask Nova"
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon />
      </FloatingButton>
    );
  }

  return (
    <ChatPanel role="dialog" aria-label="Chat assistant">
      <PanelHeader>
        <PanelTitle>Ask Nova</PanelTitle>
        <HeaderActions>
          {messages.length > 0 && (
            <IconButton
              type="button"
              onClick={clear}
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              Clear
            </IconButton>
          )}
          <CloseButton
            type="button"
            onClick={() => {
              abort();
              setIsOpen(false);
            }}
            aria-label="Close chat"
            title="Close"
          >
            ×
          </CloseButton>
        </HeaderActions>
      </PanelHeader>

      <MessagesScroll ref={scrollRef}>
        {messages.length === 0 && !isSending ? (
          <EmptyState>
            Hi! I&apos;m Nova, your insurance assistant. Ask me about your
            policies, claims, due dates, or available products.
          </EmptyState>
        ) : (
          messages.map((m) => (
            <ChatMessage key={m.id} role={m.role} content={m.content} />
          ))
        )}
        {isSending && <TypingIndicator />}
      </MessagesScroll>

      {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

      <InputRow onSubmit={handleSubmit}>
        <TextArea
          ref={textAreaRef}
          rows={1}
          value={draft}
          placeholder="Type your message..."
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          aria-label="Chat message"
        />
        <SendButton type="submit" disabled={isSending || !draft.trim()}>
          {isSending ? '...' : 'Send'}
        </SendButton>
      </InputRow>
    </ChatPanel>
  );
};

export default ChatbotWidget;
