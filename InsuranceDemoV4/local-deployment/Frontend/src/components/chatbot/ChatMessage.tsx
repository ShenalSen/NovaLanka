import React from 'react';
import { Bubble } from '../../styles/customer/Chatbot.styled';
import type { ChatRole } from '../../hooks/useChatSession';

interface ChatMessageProps {
  role: ChatRole;
  content: string;
}

/**
 * Lightweight renderer that preserves line breaks. Avoids pulling in a
 * markdown dependency; styling already uses `white-space: pre-wrap`.
 */
const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => (
  <Bubble role={role} aria-live={role === 'assistant' ? 'polite' : undefined}>
    {content}
  </Bubble>
);

export default ChatMessage;
