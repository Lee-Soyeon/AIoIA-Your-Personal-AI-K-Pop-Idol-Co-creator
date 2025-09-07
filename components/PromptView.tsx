import React, { useState } from 'react';

interface PromptViewProps {
  onSubmit: (prompt: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);


export const PromptView: React.FC<PromptViewProps> = ({ onSubmit, onBack, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('Photorealistic 4k portrait of a handsome young Korean male idol with soft, fluffy silver hair and gentle brown eyes. He\'s wearing a simple black turtleneck sweater. The background is a minimalist, warm-toned studio setting, slightly out of focus. High-quality K-pop photocard selfie style.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 text-center">
      <div className="w-full max-w-2xl">
        <button onClick={onBack} disabled={isLoading} className="flex items-center gap-2 text-slate-600 hover:text-[#4A80F5] transition-colors self-start mb-4 disabled:opacity-50">
           <BackArrowIcon />
           Back to selection
        </button>
        <h2 className="text-3xl font-bold mb-2 text-slate-800">Describe Your Idol</h2>
        <p className="text-slate-600 mb-6">Let your imagination run wild! Be as descriptive as possible to create the perfect look.</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., A charismatic idol with fiery red hair, wearing a cyberpunk jacket..."
            className="w-full h-40 p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-[#4A80F5]/50 focus:border-[#4A80F5] transition-shadow duration-200"
            aria-label="Describe your idol prompt"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full p-4 text-white text-lg font-semibold bg-gradient-to-r from-[#4A80F5] to-[#9960F4] rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Creating...' : 'Create My Idol! ✨'}
          </button>
        </form>
      </div>
    </main>
  );
};