import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
       <div className="w-2 h-2 bg-[#4A80F5] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
       <div className="w-2 h-2 bg-[#9960F4] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
       <div className="w-2 h-2 bg-[#00BFA5] rounded-full animate-bounce"></div>
       <span className="text-sm text-slate-500 ml-2">Gem is creating...</span>
    </div>
  );
};