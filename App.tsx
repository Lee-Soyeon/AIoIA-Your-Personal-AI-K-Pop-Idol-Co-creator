import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { Loader } from './components/Loader';
import { Photocard } from './components/Photocard';
import { SelectionView } from './components/SelectionView';
import { editImage, createChat, getEditSuggestions } from './services/geminiService';
import { toBase64 } from './utils/fileUtils';
import type { OriginalImage, Message } from './types';
import type { Chat } from '@google/genai';

type View = 'selection' | 'chat';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('selection');
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // State for the chatting/editing process
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);

  // Scroll to bottom effect
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);
  
  const startChatSession = useCallback(async (base64Image: string, mimeType: string) => {
    const newImage: OriginalImage = {
        base64: base64Image,
        mimeType: mimeType,
      };
      setOriginalImage(newImage);

      const photocardMessage: Message = {
        id: 'initial-photocard',
        sender: 'ai',
        content: <Photocard imageUrl={`data:${mimeType};base64,${base64Image}`} title="Your Idol is here!" isGenerated />
      };

      const chat = createChat();
      setChatSession(chat);
      // Sending an initial message primes the chat history for better context
      const initialResponse = await chat.sendMessage({ message: "Hello, I am ready to be customized!" });

      setMessages([photocardMessage, {
        id: 'initial-ai-greeting',
        sender: 'ai',
        content: "Great choice! I've brought this idol into the studio. How should we customize them first? ✨",
      }]);
      
      setView('chat');
      setIsLoading(false);
  }, []);

  const handleIdolSelect = useCallback(async (imageUrl: string) => {
    setIsLoading(true);
    setError(null);
    try {
        // Fetch the image from the public path and convert it to Base64 on the fly
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        const base64 = await toBase64(blob as File); // toBase64 works with Blobs too
        const mimeType = blob.type;

        await startChatSession(base64, mimeType);
    } catch(err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to start session: ${errorMessage}`);
        setIsLoading(false);
        setView('selection'); // Go back to selection on error
    }
  }, [startChatSession]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !originalImage) return;
    
    // Clear previous suggestions
    setMessages(prev => prev.map(msg => {
        if (!msg.suggestions) return msg;
        const { suggestions, ...rest } = msg;
        return rest;
    }));

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
        const result = await editImage(originalImage.base64, originalImage.mimeType, text);
        if (!result.base64) {
            setMessages(prev => [...prev, { id: `${Date.now()}-ai-text`, sender: 'ai', content: result.text ?? "I couldn't generate an image from that, let's try another idea!" }]);
        } else {
            const newImage: OriginalImage = { base64: result.base64, mimeType: 'image/png' };
            setOriginalImage(newImage);
            const aiPhotocard: Message = {
                id: `${Date.now()}-ai-photocard`,
                sender: 'ai',
                content: (
                <div className="flex flex-col items-center gap-4">
                    <p className="font-semibold text-center">{result.text ?? "Ta-da! Here's the new version!"}</p>
                    <Photocard imageUrl={`data:image/png;base64,${result.base64}`} title="Co-created" isGenerated />
                </div>
                )
            };
            setMessages(prev => [...prev, aiPhotocard]);

            // Get and set suggestions for the new photocard
            const suggestions = await getEditSuggestions(text);
            if (suggestions.length > 0) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.sender === 'ai') {
                        lastMessage.suggestions = suggestions;
                    }
                    return newMessages;
                });
            }
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Generation failed: ${errorMessage}`);
        setMessages(prev => [...prev, { id: 'error-msg', sender: 'ai', content: `Oh no, my magic circuits fizzled! 😵‍💫 (${errorMessage}) Let's try a different prompt.` }]);
    } finally {
        setIsLoading(false);
    }
  }, [originalImage]);
  
  const handleImageSelect = useCallback(async (file: File) => {
    setError(null);
    setIsLoading(true);
    try {
      const base64 = await toBase64(file);
      const imageUrl = URL.createObjectURL(file);
      const imageInfo: OriginalImage = { file, base64, mimeType: file.type, url: imageUrl };
      setOriginalImage(imageInfo);

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'user',
        content: <img src={imageUrl} alt="Uploaded preview" className="rounded-lg max-w-xs max-h-48" />,
      }]);
      
      if (chatSession) {
          const response = await chatSession.sendMessage({ message: "I've just uploaded a new image to edit!" });
          setMessages(prev => [...prev, { id: `${Date.now()}-ai`, sender: 'ai', content: response.text }]);
      }
    } catch (err) {
      setError('Failed to read the image file. Please try another one.');
    } finally {
        setIsLoading(false);
    }
  }, [chatSession]);

  const renderView = () => {
    switch(view) {
        case 'selection':
            return <SelectionView onIdolSelect={handleIdolSelect} />;
        case 'chat':
            return (
                <>
                    <main ref={chatWindowRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                        {messages.map(msg => 
                            <ChatMessage 
                                key={msg.id} 
                                message={msg}
                                onSelectSuggestion={handleSendMessage}
                                isLoading={isLoading}
                            />
                        )}
                        {isLoading && <Loader />}
                        {error && (
                        <div className="flex justify-center">
                            <div className="text-center text-red-700 bg-red-100 p-3 rounded-lg border border-red-200 max-w-md">
                            <p className="font-semibold">Oops! Something went wrong.</p>
                            <p className="text-sm">{error}</p>
                            </div>
                        </div>
                        )}
                    </main>
                    <footer className="bg-white/80 border-t border-slate-200 p-4 backdrop-blur-sm">
                        <div className="container mx-auto">
                        <ChatInput
                            onSendMessage={handleSendMessage}
                            onImageSelect={handleImageSelect}
                            isLoading={isLoading}
                            placeholder={"Describe your edit, e.g., 'add a sparkly crown'"}
                            isUploadingDisabled={false}
                        />
                        </div>
                    </footer>
                </>
            );
    }
  }


  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800 flex flex-col h-screen">
      <Header />
       {isLoading && view === 'selection' ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader />
          <p className="mt-4 text-slate-600">Entering the studio...</p>
        </div>
      ) : renderView()}
    </div>
  );
};

export default App;