import React, { useState, useEffect } from 'react';
import { playSound, speak } from '../services/audioService';
import { Star } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

// 3x3 Grid
const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

export const PuzzleGame: React.FC<Props> = ({ onComplete }) => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Generate a fresh image for every new game
    setImgUrl(generateImage());
    shuffleTiles();
    speak("Resmi düzelt!");
  }, []);

  const generateImage = () => {
     // Create a fun, colorful SVG image with an emoji
     const emojis = ['🦁', '🐘', '🦒', '🦄', '🦕', '🚀', '🏰', '🐙', '🦋', '🐞', '🐠'];
     const emoji = emojis[Math.floor(Math.random() * emojis.length)];
     
     // Random pastel background color
     const hues = [190, 280, 330, 140, 30, 50]; 
     const hue = hues[Math.floor(Math.random() * hues.length)];
     
     const svgString = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="hsl(${hue}, 90%, 90%)" />
        
        <!-- Grid Guide Lines (to help matching edges) -->
        <path d="M100 0 V300 M200 0 V300 M0 100 H300 M0 200 H300" stroke="white" stroke-width="4" stroke-dasharray="10 5" opacity="0.5"/>
        
        <!-- Large Background Shapes for orientation -->
        <circle cx="0" cy="0" r="100" fill="hsl(${hue}, 90%, 80%)" />
        <circle cx="300" cy="300" r="120" fill="hsl(${hue}, 90%, 80%)" />
        <rect x="220" y="20" width="60" height="60" rx="10" fill="hsl(${hue + 40}, 80%, 70%)" />
        <circle cx="50" cy="250" r="30" fill="hsl(${hue - 40}, 80%, 70%)" />
        
        <!-- Center Highlight -->
        <circle cx="150" cy="150" r="110" fill="white" opacity="0.6" />
        
        <!-- Main Character -->
        <text x="150" y="165" font-family="Arial, sans-serif" font-size="130" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
        
        <!-- Border -->
        <rect x="5" y="5" width="290" height="290" rx="15" fill="none" stroke="hsl(${hue}, 80%, 60%)" stroke-width="10" />
      </svg>
     `.trim();
     
     // Safe base64 encoding for unicode strings
     const base64 = btoa(unescape(encodeURIComponent(svgString)));
     return `data:image/svg+xml;base64,${base64}`;
  };

  const shuffleTiles = () => {
    let arr = Array.from({ length: TILE_COUNT }, (_, i) => i);
    // Simple swap shuffle
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setTiles(arr);
    setIsComplete(false);
  };

  const checkWin = (currentTiles: number[]) => {
    const isWin = currentTiles.every((val, index) => val === index);
    if (isWin) {
      setIsComplete(true);
      playSound('win');
      speak("Harikasın! Resim tamam.");
      // Trigger callback after animation
      setTimeout(onComplete, 3000);
    }
  };

  const handleTileClick = (index: number) => {
    if (isComplete) return;
    
    playSound('click');
    
    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      if (selectedIdx === index) {
        setSelectedIdx(null); // Deselect
        return;
      }
      
      // Swap tiles
      const newTiles = [...tiles];
      [newTiles[selectedIdx], newTiles[index]] = [newTiles[index], newTiles[selectedIdx]];
      setTiles(newTiles);
      setSelectedIdx(null);
      playSound('correct'); 
      checkWin(newTiles);
    }
  };

  if (isComplete) {
    return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in space-y-8">
           <div className="relative p-2 bg-white rounded-3xl shadow-xl ring-8 ring-green-400 transform scale-105 transition-transform">
               {imgUrl && <img src={imgUrl} className="w-[300px] h-[300px] rounded-2xl" alt="Completed Puzzle" />}
               <div className="absolute -top-6 -right-6 text-6xl animate-bounce">🌟</div>
           </div>
           
           <div className="flex flex-col items-center gap-2">
             <h2 className="text-4xl font-black text-white drop-shadow-md animate-pulse">Mükemmel!</h2>
             <div className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-bold text-xl flex items-center gap-2 animate-bounce shadow-lg">
                <Star fill="currentColor" />
                <span>+1 Yıldız!</span>
             </div>
           </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="relative bg-white/50 p-4 rounded-3xl shadow-xl backdrop-blur-sm border-4 border-white/60">
        {/* Exact 300x300 container with NO GAPS to make image continuous */}
        <div 
          className="grid grid-cols-3 gap-0 bg-white rounded-xl overflow-hidden shadow-2xl"
          style={{ width: '300px', height: '300px' }}
        >
          {tiles.map((tilePos, visualIdx) => {
             const row = Math.floor(tilePos / GRID_SIZE);
             const col = tilePos % GRID_SIZE;
             const isSelected = selectedIdx === visualIdx;

             return (
               <button
                 key={visualIdx}
                 onClick={() => handleTileClick(visualIdx)}
                 className={`relative w-[100px] h-[100px] transition-all duration-200 overflow-hidden border border-white/20 ${isSelected ? 'z-10 ring-4 ring-yellow-400 scale-105 shadow-xl' : 'hover:brightness-110 active:scale-95'}`}
               >
                 {imgUrl && (
                    <div 
                        className="absolute top-0 left-0 w-full h-full bg-no-repeat"
                        style={{
                          backgroundImage: `url(${imgUrl})`,
                          backgroundSize: '300px 300px',
                          // Exact pixel mapping
                          backgroundPosition: `-${col * 100}px -${row * 100}px`,
                        }}
                    />
                 )}
                 {/* Stronger visual hint numbers */}
                 <span className="absolute bottom-1 right-1 w-6 h-6 flex items-center justify-center text-sm font-bold text-white bg-black/40 rounded-full backdrop-blur-md shadow-sm border border-white/20">
                   {tilePos + 1}
                 </span>
               </button>
             );
          })}
        </div>
      </div>
      <p className="text-white text-lg font-bold drop-shadow-md bg-white/20 px-6 py-2 rounded-full">
        Parçaları değiştirmek için dokun!
      </p>
    </div>
  );
};