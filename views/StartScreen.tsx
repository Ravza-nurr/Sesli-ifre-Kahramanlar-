import React, { useEffect } from 'react';
import { Button } from '../components/Button';
import { speak } from '../services/audioService';

interface Props {
  onStart: () => void;
}

export const StartScreen: React.FC<Props> = ({ onStart }) => {
  useEffect(() => {
    // Small delay to allow interaction first usually, but we can greet if clicked
  }, []);

  const handleEnter = () => {
    speak("Merhaba minik kahraman! Hadi oyuna girelim.");
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in">
      <div className="relative">
        <div className="absolute -top-10 -left-10 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🎈</div>
        <div className="absolute top-0 -right-12 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</div>
        <div className="bg-white/30 p-10 rounded-[3rem] backdrop-blur-md shadow-xl border-4 border-white/50">
           <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] tracking-wide leading-tight">
             Sesli<br/>
             <span className="text-yellow-300">Şifre</span><br/>
             Dünyası
           </h1>
        </div>
        <div className="absolute -bottom-8 -left-8 text-6xl animate-bounce" style={{ animationDelay: '1s' }}>🎨</div>
        <div className="absolute -bottom-10 -right-10 text-6xl animate-bounce" style={{ animationDelay: '1.5s' }}>🧩</div>
      </div>

      <div className="pt-10">
        <Button size="xl" onClick={handleEnter} className="animate-pulse">
          OYUNA GİR 🚀
        </Button>
      </div>
    </div>
  );
};