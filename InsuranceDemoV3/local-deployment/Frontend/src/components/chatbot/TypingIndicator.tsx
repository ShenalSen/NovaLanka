import React from 'react';
import { Bubble, TypingDots } from '../../styles/customer/Chatbot.styled';

const TypingIndicator: React.FC = () => (
  <Bubble role="assistant" aria-label="Assistant is typing">
    <TypingDots>
      <span />
      <span />
      <span />
    </TypingDots>
  </Bubble>
);

export default TypingIndicator;
