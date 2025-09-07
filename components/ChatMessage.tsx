import React from 'react';
import type { Message } from '../types';
import { SuggestionChips } from './SuggestionChips';

interface ChatMessageProps {
  message: Message;
  onSelectSuggestion: (suggestion: string) => void;
  isLoading: boolean;
}

const AiAvatar: React.FC = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A80F5] to-[#9960F4] flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
       G
    </div>
)

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectSuggestion, isLoading }) => {
  const isUser = message.sender === 'user';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-[#4A80F5] text-white rounded-t-2xl rounded-bl-2xl'
    : 'bg-white text-slate-700 rounded-t-2xl rounded-br-2xl border border-slate-200';

  return (
    <div className={`w-full flex items-start gap-3 ${containerClasses}`}>
        {!isUser && <AiAvatar />}
        <div className="flex flex-col">
            <div className={`max-w-md md:max-w-lg p-4 shadow-md ${bubbleClasses}`}>
            {typeof message.content === 'string' ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
                message.content
            )}
            </div>
            {!isUser && message.suggestions && message.suggestions.length > 0 && (
                <SuggestionChips
                    suggestions={message.suggestions}
                    onSelect={onSelectSuggestion}
                    isLoading={isLoading}
                />
            )}
        </div>
    </div>
  );
};