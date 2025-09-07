import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <SparklesIcon />
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#4A80F5] to-[#9960F4] text-transparent bg-clip-text ml-2">
          AI Idol Photocard Co-creator
        </h1>
      </div>
    </header>
  );
};