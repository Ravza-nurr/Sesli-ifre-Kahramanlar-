import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { speak, playSound } from '../services/audioService';
import { STICKERS } from '../constants';

interface Props {
  onComplete: () => void;
}

const SYMBOLS = [
  { char: '☀️', val: 1 },
  { char: '🍎', val: 2 },
  { char: '🌙', val: 3 },
  { char: '💎', val: 4 },
  { char: '☘️', val: 5 },
];

export const CodeGame: React.FC<Props> = ({ onComplete }) => {
  const [level, setLevel] = useState(1);
  const [targetPattern, setTargetPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Generate new level
  useEffect(() => {
    generatePattern();
    speak(`Seviye ${level}. Şifreyi çöz!`);
  }, [level]);

  const generatePattern = () => {
    const length = Math.min(2 + Math.floor(level / 2), 5); // Length 2 to 5
    const newPattern: number[] = [];
    for(let i=0; i<length; i++) {
      const rand = Math.floor(Math.random() * 3) + 1; // 1-3 for ease at start
      newPattern.push(rand);
    }
    setTargetPattern(newPattern);
    setUserPattern([]);
  };

  const handleInput = (val: number) => {
    const newPattern = [...userPattern, val];
    setUserPattern(newPattern);
    playSound('click');

    // Check correctness immediately if length matches
    if (newPattern.length === targetPattern.length) {
      const isCorrect = newPattern.every((v, i) => v === targetPattern[i]);
      if (isCorrect) {
        playSound('correct');
        speak("Harika! Şifre doğru.");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          if (level >= 5) {
             playSound('win');
             onComplete();
          } else {
             setLevel(l => l + 1);
          }
        }, 1500);
      } else {
        playSound('wrong');
        speak("Tekrar dene!");
        setTimeout(() => setUserPattern([]), 500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-white p-8 rounded-3xl text-center transform scale-110 transition-transform">
              <div className="text-8xl animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-green-500 mt-4">Doğru!</h2>
           </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 bg-white/40 p-4 rounded-2xl">
        {SYMBOLS.slice(0, 3).map((s) => (
           <div key={s.val} className="flex flex-col items-center bg-white p-3 rounded-xl shadow-sm">
              <span className="text-4xl">{s.char}</span>
              <span className="text-2xl font-black text-gray-500 mt-1">{s.val}</span>
           </div>
        ))}
      </div>

      {/* Problem Display */}
      <div className="flex items-center gap-2 p-6 bg-indigo-500/20 rounded-3xl border-4 border-indigo-300 w-full justify-center min-h-[120px]">
        {targetPattern.map((num, i) => {
          const symbol = SYMBOLS.find(s => s.val === num);
          const isRevealed = userPattern.length > i;
          return (
            <div key={i} className="flex flex-col items-center animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="text-5xl drop-shadow-md">{symbol?.char}</span>
              <div className="w-12 h-12 mt-2 bg-white rounded-xl flex items-center justify-center border-b-4 border-gray-200">
                 {isRevealed ? (
                   <span className="text-2xl font-bold text-gray-700">{userPattern[i]}</span>
                 ) : (
                   <span className="text-2xl font-bold text-gray-300">?</span>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => handleInput(num)}
            className="w-20 h-20 bg-yellow-400 rounded-2xl text-4xl font-black text-white shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all border-b-4 border-yellow-600"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};