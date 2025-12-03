import React, { useState, useEffect, useRef } from 'react';
import { playSound, speak } from '../services/audioService';
import { Profile } from '../types';
import { Star, Trophy, Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
  profile: Profile | null;
}

const ICONS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'];

export const MemoryGame: React.FC<Props> = ({ onComplete }) => {
  const [cards, setCards] = useState<{id: number, icon: string, matched: boolean, shaking?: boolean}[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameId, setGameId] = useState(0); // Forces grid reset
  const [confetti, setConfetti] = useState<{id: number, x: number, y: number, color: string, speed: number, rotation: number}[]>([]);
  const requestRef = useRef<number>();

  // --- Game Logic ---

  useEffect(() => {
    startLevel(1);
    speak("Hazır mısın? Kartları bul!");
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const startLevel = (lvl: number) => {
    setLevel(lvl);
    
    // Level 1: 3 pairs (6 cards)
    // Level 2: 6 pairs (12 cards)
    // MAX LEVEL is 2.
    let pairCount = 3;
    if (lvl >= 2) pairCount = 6;

    // Safety: Ensure we don't request more pairs than available icons
    const safePairCount = Math.min(pairCount, ICONS.length);

    // 1. Prepare Source: Shuffle copy of ALL icons to ensure variety each game
    const sourceIcons = [...ICONS];
    for (let i = sourceIcons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sourceIcons[i], sourceIcons[j]] = [sourceIcons[j], sourceIcons[i]];
    }

    // 2. Select N unique icons
    const selected = sourceIcons.slice(0, safePairCount);

    // 3. Create Pairs: Duplicate selected icons
    const deckArr = [...selected, ...selected];
    
    // 4. Robust Fisher-Yates Shuffle
    for (let i = deckArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckArr[i], deckArr[j]] = [deckArr[j], deckArr[i]];
    }

    // 5. Create State Objects
    const deck = deckArr.map((icon, i) => ({ 
        id: i, 
        icon, 
        matched: false 
    }));
    
    setCards(deck);
    setFlippedIndices([]);
    setIsLocked(false);
    setConfetti([]);
    setGameId(prev => prev + 1); // Force re-render of keys
    
    if (lvl > 1) {
        playSound('levelUp');
        speak(`Harika! Seviye ${lvl}.`);
    }
  };

  const handleCardClick = (index: number) => {
    // Basic guards
    if (isLocked) return;
    if (flippedIndices.includes(index)) return;
    if (cards[index].matched) return;

    playSound('flip');
    
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [first, second] = newFlipped;
      
      if (cards[first].icon === cards[second].icon) {
        // Match!
        handleMatch(first, second);
      } else {
        // No match
        handleMismatch(first, second);
      }
    }
  };

  const handleMatch = (first: number, second: number) => {
    setTimeout(() => {
        playSound('correct');
        
        // Use functional update to ensure we work with latest state and avoid mutation
        setCards(prevCards => {
            const newCards = prevCards.map((card, idx) => {
                if (idx === first || idx === second) {
                    return { ...card, matched: true };
                }
                return card;
            });

            // Check Win condition inside the update to use the latest data
            const allMatched = newCards.every(c => c.matched);
            if (allMatched) {
                 handleWin();
            }

            return newCards;
        });

        setFlippedIndices([]);
        setIsLocked(false);
    }, 600);
  };

  const handleMismatch = (first: number, second: number) => {
    setTimeout(() => {
        playSound('wrong');

        // Shake effect
        setCards(prevCards => prevCards.map((card, idx) => {
            if (idx === first || idx === second) {
                return { ...card, shaking: true };
            }
            return card;
        }));

        setTimeout(() => {
          setFlippedIndices([]);
          
          // Remove shake
          setCards(prevCards => prevCards.map((card, idx) => {
            if (idx === first || idx === second) {
                return { ...card, shaking: false };
            }
            return card;
          }));
          
          setIsLocked(false);
        }, 800);
    }, 800);
  };

  const handleWin = () => {
    // Play win sound immediately
    playSound('win');
    spawnConfetti();

    // Delay next actions
    setTimeout(() => {
        // Finish after Level 2
        if (level < 2) {
            startLevel(level + 1);
        } else {
            speak("Tebrikler şampiyon! Hepsini bitirdin.");
            setTimeout(onComplete, 3000);
        }
    }, 3000);
  };

  // --- Effects ---

  const spawnConfetti = () => {
    const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'];
    const particles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // %
      y: -10 - Math.random() * 20, // %
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 1 + Math.random() * 3,
      rotation: Math.random() * 360,
      wobble: Math.random() * 10
    }));
    setConfetti(particles);
    
    let startTime = Date.now();
    const animate = () => {
       const now = Date.now();
       const dt = (now - startTime) / 1000;
       
       setConfetti(prev => prev.map(p => ({
           ...p,
           y: p.y + p.speed * 0.5,
           rotation: p.rotation + 5,
           x: p.x + Math.sin(p.y / 10 + p.wobble) * 0.5
       })).filter(p => p.y < 110));

       if (Date.now() - startTime < 4000) {
           requestRef.current = requestAnimationFrame(animate);
       } else {
           setConfetti([]);
       }
    };
    requestRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center justify-start h-full w-full relative overflow-hidden">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>

      {/* Confetti Layer */}
      {confetti.map(p => (
          <div 
            key={p.id}
            style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: '10px',
                height: '10px',
                backgroundColor: p.color,
                transform: `rotate(${p.rotation}deg)`,
                pointerEvents: 'none',
                zIndex: 50
            }}
          />
      ))}

      {/* Top HUD: Level Bar (Only 2 Levels) */}
      <div className="w-full max-w-md px-4 mt-2 flex items-center gap-4 shrink-0">
         <div className="flex-1 bg-white/40 h-8 rounded-full p-1 flex items-center relative overflow-hidden shadow-inner">
            <div 
                className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full transition-all duration-1000 ease-out flex items-center justify-center"
                style={{ width: `${(level / 2) * 100}%` }}
            >
                <div className="animate-[shimmer_2s_infinite] absolute inset-0 bg-white/30 skew-x-12 transform -translate-x-full"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-around px-4 text-xs font-bold text-gray-600/50">
                <span>1</span>
                <span>2</span>
            </div>
         </div>
         <div className="bg-white px-3 py-1 rounded-full shadow-md font-black text-orange-500 flex items-center gap-1">
             <Trophy size={16} />
             <span>LVL {level}</span>
         </div>
      </div>

      {/* Main Game Board */}
      <div className="flex-1 flex flex-col items-center justify-center w-full p-4">
         <div className={`relative bg-[#d4a373] p-4 md:p-6 rounded-[1.5rem] shadow-[0_10px_0_#a97142] border-b-8 border-[#a97142] transition-all duration-500 w-full max-w-lg`}>
            
            {/* Board Textures */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#754a2a] opacity-50"></div>
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#754a2a] opacity-50"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#754a2a] opacity-50"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#754a2a] opacity-50"></div>

            <div className={`grid gap-3 transition-all duration-500 ${level === 1 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {cards.map((card, idx) => {
                 const isFlipped = flippedIndices.includes(idx) || card.matched;
                 return (
                   <div 
                     key={`${gameId}-${idx}`} 
                     className={`perspective-1000 aspect-[3/4] cursor-pointer ${card.shaking ? 'animate-shake' : ''} ${card.matched ? 'opacity-80 scale-95 cursor-default' : ''}`}
                     onClick={() => handleCardClick(idx)}
                   >
                      <div 
                        className={`w-full h-full relative transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                      >
                        {/* Front Face (Icon) */}
                        <div 
                            className="absolute inset-0 bg-white rounded-xl flex items-center justify-center text-4xl border-b-4 border-gray-200 backface-hidden shadow-sm z-10" 
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                           {card.icon}
                           {card.matched && (
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                               <Sparkles className="text-yellow-400 w-full h-full p-2 animate-spin-slow opacity-50" />
                             </div>
                           )}
                        </div>

                        {/* Back Face (Pattern) */}
                        <div 
                            className="absolute inset-0 bg-red-400 rounded-xl flex items-center justify-center backface-hidden border-b-4 border-red-600 shadow-sm"
                        >
                           <div className="w-full h-full opacity-20 bg-[radial-gradient(#fff_25%,transparent_25%)] [background-size:8px_8px]"></div>
                           <div className="absolute bg-white/20 p-2 rounded-full">
                             <Star size={16} className="text-white" fill="currentColor" />
                           </div>
                        </div>
                      </div>
                   </div>
                 );
              })}
            </div>
         </div>
      </div>
    </div>
  );
};