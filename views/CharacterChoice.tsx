import React, { useEffect } from 'react';
import { CHARACTERS } from '../constants';
import { speak } from '../services/audioService';

interface Props {
  onSelect: (charId: string) => void;
}

export const CharacterChoice: React.FC<Props> = ({ onSelect }) => {
  useEffect(() => {
    speak("Hangi karakter olmak istersin?");
  }, []);

  return (
    <div className="flex flex-col items-center h-full justify-center">
      <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-md text-center">Karakterini Seç!</h2>
      
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        {CHARACTERS.map((char) => (
          <button
            key={char.id}
            onClick={() => {
              speak(char.name);
              onSelect(char.id);
            }}
            className={`${char.color} aspect-square rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-2 transition-all flex flex-col items-center justify-center border-4 border-white/30 p-4`}
          >
            <span className="text-6xl mb-2 filter drop-shadow-sm">{char.emoji}</span>
            <span className="text-white font-bold text-lg leading-tight text-center">{char.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};