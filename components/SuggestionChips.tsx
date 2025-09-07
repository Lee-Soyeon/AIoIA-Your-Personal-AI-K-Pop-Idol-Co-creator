import React from 'react';

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  isLoading: boolean;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onSelect, isLoading }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm font-medium text-[#7E57C2] bg-[#F3E8FD] rounded-full hover:bg-[#E9D5FF] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {suggestion} 🔮
        </button>
      ))}
    </div>
  );
};