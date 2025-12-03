import React, { useEffect } from 'react';
import { Button } from '../components/Button';
import { speak } from '../services/audioService';
import { ScreenType } from '../types';
import { Brain, Grid, Image as ImageIcon, Palette } from 'lucide-react';

interface Props {
  onNavigate: (screen: ScreenType) => void;
}

export const GameHub: React.FC<Props> = ({ onNavigate }) => {
  useEffect(() => {
    // Only speak if just mounted
    // speak("Bugün ne oynamak istersin?"); 
  }, []);

  const menuItems = [
    { 
      id: 'GAME_CODE', 
      label: 'Şifre Oyunu', 
      icon: <Brain size={40} />, 
      color: 'bg-indigo-400',
      voice: "Şifre oyunu"
    },
    { 
      id: 'GAME_MEMORY', 
      label: 'Hafıza Oyunu', 
      icon: <Grid size={40} />, 
      color: 'bg-pink-400',
      voice: "Hafıza oyunu"
    },
    { 
      id: 'GAME_PUZZLE', 
      label: 'Yapboz', 
      icon: <ImageIcon size={40} />, 
      color: 'bg-teal-400',
      voice: "Eğlenceli yapboz"
    },
    { 
      id: 'GAME_CREATIVE', 
      label: 'Oyun Odası', 
      icon: <Palette size={40} />, 
      color: 'bg-orange-400',
      voice: "Oyun odası"
    },
  ];

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              speak(item.voice);
              onNavigate(item.id as ScreenType);
            }}
            className={`${item.color} w-full py-8 rounded-[2rem] shadow-[0_8px_0_rgba(0,0,0,0.15)] active:translate-y-2 active:shadow-none transition-all border-4 border-white/20 text-white flex flex-col items-center gap-3 group`}
          >
            <div className="p-4 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <span className="text-2xl font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};