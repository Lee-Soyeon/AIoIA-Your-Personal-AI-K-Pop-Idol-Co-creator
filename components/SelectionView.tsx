import React from 'react';
import { Photocard } from './Photocard';

interface SelectionViewProps {
  onIdolSelect: (imageUrl: string) => void;
}

// Use a more descriptive data structure for our idols.
const rookies = [
    { name: 'Eunwoo', path: '/Eunwoo.png' },
    { name: 'Gangjun', path: '/Gangjun.png' },
    { name: 'Junghyuk', path: '/Junghyuk.png' },
    { name: 'Yaechan', path: '/Yaechan.png' },
    { name: 'Yoonjae', path: '/Yoonjae.png' },
];

export const SelectionView: React.FC<SelectionViewProps> = ({ onIdolSelect }) => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 text-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-2 text-slate-800">Choose Your Idol</h2>
        <p className="text-slate-600 mb-8">Select an idol to start customizing your own photocard!</p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {rookies.map((rookie) => (
            <button
              key={rookie.path}
              onClick={() => onIdolSelect(rookie.path)}
              className="transform transition-transform duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#9960F4] rounded-xl"
            >
              <Photocard
                imageUrl={rookie.path} // Directly use the image path
                title={rookie.name}
                isGenerated={false}
              />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};
