import React, { useState, useRef } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onImageSelect: (file: File) => void;
  isLoading: boolean;
  placeholder: string;
  isUploadingDisabled?: boolean;
}

const PaperclipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onImageSelect, isLoading, placeholder, isUploadingDisabled = false }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };

  return (
    <div className="flex items-center gap-2 md:gap-4">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <button 
        onClick={() => fileInputRef.current?.click()} 
        disabled={isLoading || isUploadingDisabled}
        className="p-2 text-slate-500 hover:text-[#4A80F5] disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
        aria-label="Attach an image"
        >
        <PaperclipIcon />
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 w-full p-3 border border-slate-300 rounded-full focus:ring-2 focus:ring-[#4A80F5]/50 focus:border-[#4A80F5] transition-shadow duration-200"
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
        className="p-3 text-white bg-gradient-to-r from-[#4A80F5] to-[#9960F4] rounded-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
};