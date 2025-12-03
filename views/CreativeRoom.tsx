import React, { useRef, useState, useEffect } from 'react';
import { STICKERS } from '../constants';
import { playSound, speak } from '../services/audioService';
import { Trash2, Save, Image as ImageIcon, Smile } from 'lucide-react';

interface Props {
  onSave: (dataUrl: string) => void;
  savedDrawings: string[];
}

const COLORS = ['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export const CreativeRoom: React.FC<Props> = ({ onSave, savedDrawings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'pen' | 'sticker'>('pen');
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stickers' | 'gallery'>('stickers');
  const [canvasSnapshot, setCanvasSnapshot] = useState<ImageData | null>(null);

  useEffect(() => {
    speak("Burası senin odan. İstediğini çiz!");
    
    // Prevent scrolling
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
    return () => {
        if (canvas) canvas.removeEventListener('touchmove', (e) => e.preventDefault());
    }
  }, []);

  // Handle Resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Save current content
      const ctx = canvas.getContext('2d');
      let savedData: string | null = null;
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        savedData = canvas.toDataURL();
      }

      // Resize
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      // Restore settings
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
        // Restore content
        if (savedData) {
            const img = new Image();
            img.src = savedData;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
        } else {
             ctx.fillStyle = '#FFFFFF';
             ctx.fillRect(0,0, canvas.width, canvas.height);
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
        handleResize();
    });

    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent | any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.changedTouches && e.changedTouches.length > 0) {
       clientX = e.changedTouches[0].clientX;
       clientY = e.changedTouches[0].clientY;
    } else {
       clientX = e.clientX;
       clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDraw = (e: any) => {
    if (activeTool === 'sticker' && selectedSticker) {
       placeSticker(e);
       return;
    }

    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if(ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = color;
    }
  };

  const draw = (e: any) => {
    if (!isDrawing || activeTool === 'sticker') return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if(ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDraw = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if(ctx) ctx.closePath();
  };

  const placeSticker = (e: any) => {
     const { x, y } = getPos(e);
     const ctx = canvasRef.current?.getContext('2d');
     if(ctx && selectedSticker) {
       playSound('click');
       ctx.font = "40px Arial";
       ctx.textAlign = "center";
       ctx.textBaseline = "middle";
       ctx.fillText(selectedSticker, x, y);
     }
  };

  const clearCanvas = () => {
    playSound('wrong');
    const canvas = canvasRef.current;
    if(canvas) {
        const ctx = canvas.getContext('2d');
        if(ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0,0, canvas.width, canvas.height);
        }
    }
  };

  const handleSave = () => {
    if(canvasRef.current) {
        playSound('win');
        speak("Resmin kaydedildi!");
        onSave(canvasRef.current.toDataURL());
        setActiveTab('gallery');
    }
  };

  const loadDrawing = (src: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
        playSound('correct');
        speak("Resim yüklendi!");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  return (
    <div className="flex flex-col h-full gap-1">
      {/* Tools */}
      <div className="bg-white/50 py-1 px-2 rounded-2xl flex items-center justify-between overflow-x-auto gap-4 scrollbar-hide shrink-0 shadow-sm">
         <div className="flex gap-2 items-center">
            {COLORS.map(c => (
                <button
                   key={c}
                   onClick={() => { setColor(c); setActiveTool('pen'); playSound('click'); }}
                   className={`w-7 h-7 rounded-full border-2 border-white shadow-sm transition-transform ${color === c && activeTool === 'pen' ? 'scale-125 ring-2 ring-blue-400' : 'hover:scale-110'}`}
                   style={{ backgroundColor: c }}
                />
            ))}
         </div>
         <div className="w-[1px] h-5 bg-gray-300 mx-1" />
         <div className="flex gap-2">
             <button onClick={clearCanvas} className="p-1.5 bg-red-100 rounded-xl text-red-500 hover:bg-red-200 shadow-sm active:scale-90 transition-transform">
                 <Trash2 size={18} />
             </button>
             <button onClick={handleSave} className="p-1.5 bg-green-100 rounded-xl text-green-500 hover:bg-green-200 shadow-sm active:scale-90 transition-transform">
                 <Save size={18} />
             </button>
         </div>
      </div>

      {/* Canvas Area - Flex 1 takes all available space */}
      <div ref={containerRef} className="flex-1 bg-white rounded-xl shadow-inner border-2 border-white/50 relative overflow-hidden touch-none">
         <canvas
            ref={canvasRef}
            className="block touch-none cursor-crosshair"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
         />
      </div>

      {/* Bottom Panel */}
      <div className="bg-white/50 p-1.5 rounded-2xl shrink-0 flex flex-col gap-1 shadow-sm h-32">
         {/* Tabs */}
         <div className="flex gap-2">
            <button 
              onClick={() => { setActiveTab('stickers'); playSound('click'); }}
              className={`flex-1 py-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === 'stickers' ? 'bg-white shadow-sm text-blue-500' : 'text-gray-600 hover:bg-white/30'}`}
            >
               <Smile size={14} />
               Çıkartmalar
            </button>
            <button 
              onClick={() => { setActiveTab('gallery'); playSound('click'); }}
              className={`flex-1 py-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === 'gallery' ? 'bg-white shadow-sm text-purple-500' : 'text-gray-600 hover:bg-white/30'}`}
            >
               <ImageIcon size={14} />
               Resimlerim
            </button>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-x-auto overflow-y-hidden">
            {activeTab === 'stickers' ? (
                <div className="flex gap-2 min-w-max px-1 items-center h-full">
                    {STICKERS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => { setSelectedSticker(s.emoji); setActiveTool('sticker'); playSound('click'); }}
                            className={`text-4xl p-1 rounded-xl transition-transform ${selectedSticker === s.emoji && activeTool === 'sticker' ? 'bg-yellow-200 scale-110 shadow-sm' : 'hover:scale-110'}`}
                        >
                            {s.emoji}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex gap-2 min-w-max px-1 items-center h-full">
                    {savedDrawings.length === 0 ? (
                        <div className="text-gray-500 italic text-xs w-full text-center">
                           Henüz kaydedilmiş resim yok.
                        </div>
                    ) : (
                        savedDrawings.map((src, idx) => (
                           <button 
                              key={idx}
                              onClick={() => loadDrawing(src)}
                              className="relative w-16 h-16 rounded-lg border-2 border-white shadow-sm overflow-hidden hover:scale-105 transition-transform bg-white active:ring-2 active:ring-purple-400"
                           >
                              <img src={src} className="w-full h-full object-cover" alt={`Drawing ${idx}`} />
                           </button>
                        ))
                    )}
                </div>
            )}
         </div>
      </div>
    </div>
  );
};