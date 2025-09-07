import React from 'react';

interface PhotocardProps {
  imageUrl: string;
  title: string;
  isGenerated?: boolean;
}

export const Photocard: React.FC<PhotocardProps> = ({ imageUrl, title, isGenerated = false }) => {
  const borderColor = isGenerated ? 'border-[#4A80F5]' : 'border-slate-300';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative w-48 h-64 bg-slate-100 rounded-xl shadow-lg p-2 border-2 ${borderColor} transition-transform duration-300 hover:shadow-2xl`}
      >
        <img src={imageUrl} alt={title} className="w-full h-full object-cover rounded-lg" />
        {isGenerated && (
          <div className="absolute top-1 right-1 bg-gradient-to-r from-[#4A80F5] to-[#9960F4] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            AI ✨
          </div>
        )}
      </div>
      <h3 className="font-semibold text-slate-600">{title}</h3>
    </div>
  );
};