import React from 'react';
import { CHARACTERS } from '../constants';
import { Profile } from '../types';
import { Home, Star, Volume2 } from 'lucide-react';
import { playSound } from '../services/audioService';

interface LayoutProps {
  children: React.ReactNode;
  profile: Profile | null;
  onHome?: () => void;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, profile, onHome, title }) => {
  const activeChar = profile ? CHARACTERS.find(c => c.id === profile.characterId) : null;
  const bgGradient = activeChar ? activeChar.bgGradient : 'from-blue-200 to-pink-200';

  return (
    <div className={`h-[100dvh] w-full bg-gradient-to-b ${bgGradient} p-2 flex flex-col items-center overflow-hidden touch-none`}>
      {/* Header - Compacted */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-2 bg-white/40 p-2 rounded-full backdrop-blur-sm shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          {onHome && (
            <button 
              onClick={() => { playSound('click'); onHome(); }}
              className="p-2 bg-white rounded-full text-blue-500 shadow-md active:scale-90 transition-transform"
            >
              <Home size={24} />
            </button>
          )}
          {profile && (
             <div className="flex items-center gap-2 px-3 py-1 bg-white/60 rounded-full">
                <span className="text-2xl filter drop-shadow-md">{activeChar?.emoji}</span>
                <span className="hidden sm:block font-bold text-gray-700 text-sm">{profile.name}</span>
             </div>
          )}
        </div>
        
        {title && <h1 className="text-xl font-black text-white drop-shadow-md tracking-wider animate-pulse hidden md:block">{title}</h1>}

        <div className="flex items-center gap-2">
           {profile && (
             <div className="flex items-center gap-1 bg-yellow-300 px-3 py-1 rounded-full shadow-sm text-yellow-800 font-bold border-2 border-yellow-400">
               <Star size={20} fill="currentColor" />
               <span className="text-lg">{profile.stars}</span>
             </div>
           )}
           <button 
             onClick={() => { playSound('click'); }} 
             className="p-2 bg-white/50 rounded-full text-gray-700 active:scale-90 transition-transform"
           >
             <Volume2 size={20} />
           </button>
        </div>
      </div>

      {/* Content Area - Flex 1 fills remaining height */}
      <main className="w-full max-w-4xl flex-1 flex flex-col relative z-0 min-h-0">
        {children}
      </main>
    </div>
  );
};