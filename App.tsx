import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StartScreen } from './views/StartScreen';
import { CharacterChoice } from './views/CharacterChoice';
import { GameHub } from './views/GameHub';
import { CodeGame } from './views/CodeGame';
import { MemoryGame } from './views/MemoryGame';
import { PuzzleGame } from './views/PuzzleGame';
import { CreativeRoom } from './views/CreativeRoom';
import { loadData, saveData, createProfile } from './services/storageService';
import { Profile, SaveData, ScreenType } from './types';
import { STICKERS, GAME_TITLES } from './constants';
import { speak, playSound } from './services/audioService';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('START');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [allData, setAllData] = useState<SaveData>({ profiles: {}, activeProfileId: null });

  // Load initial data
  useEffect(() => {
    const data = loadData();
    setAllData(data);
    if (data.activeProfileId && data.profiles[data.activeProfileId]) {
       setProfile(data.profiles[data.activeProfileId]);
       // Don't auto-skip start screen to give a "Session start" feel
    }
  }, []);

  const updateProfile = (updates: Partial<Profile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    
    const newData = {
      ...allData,
      profiles: {
        ...allData.profiles,
        [newProfile.id]: newProfile
      }
    };
    setAllData(newData);
    saveData(newData);
  };

  const handleStart = () => {
     if (profile) {
       setScreen('GAME_HUB');
     } else {
       setScreen('CHARACTER_CHOICE');
     }
  };

  const handleCharacterSelect = (charId: string) => {
     const newProfile = createProfile(charId);
     const newData = {
       profiles: { ...allData.profiles, [newProfile.id]: newProfile },
       activeProfileId: newProfile.id
     };
     setAllData(newData);
     setProfile(newProfile);
     saveData(newData);
     
     playSound('win');
     setTimeout(() => setScreen('GAME_HUB'), 500);
  };

  const handleGameComplete = () => {
     if (!profile) return;
     // Add star
     const newStars = profile.stars + 1;
     
     // Random sticker chance (30%)
     let newStickers = [...profile.stickers];
     if (Math.random() > 0.3) {
         const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
         if (!newStickers.includes(randomSticker.id)) {
             newStickers.push(randomSticker.id);
             speak(`Yeni çıkartma kazandın: ${randomSticker.name}`);
         }
     }

     updateProfile({ stars: newStars, stickers: newStickers });
     setTimeout(() => setScreen('GAME_HUB'), 500); // Shorter delay as the animation was handled in game view
  };

  const handleSaveDrawing = (dataUrl: string) => {
      if(!profile) return;
      const newDrawings = [dataUrl, ...profile.drawings].slice(0, 10); // Keep last 10
      updateProfile({ drawings: newDrawings });
  };

  const getScreenTitle = () => {
    switch(screen) {
      case 'GAME_CODE': return GAME_TITLES.CODE;
      case 'GAME_MEMORY': return GAME_TITLES.MEMORY;
      case 'GAME_PUZZLE': return GAME_TITLES.PUZZLE;
      case 'GAME_CREATIVE': return GAME_TITLES.CREATIVE;
      default: return "";
    }
  };

  return (
    <Layout 
      profile={screen === 'START' ? null : profile}
      onHome={screen !== 'START' && screen !== 'CHARACTER_CHOICE' && screen !== 'GAME_HUB' ? () => setScreen('GAME_HUB') : undefined}
      title={getScreenTitle()}
    >
      {screen === 'START' && <StartScreen onStart={handleStart} />}
      {screen === 'CHARACTER_CHOICE' && <CharacterChoice onSelect={handleCharacterSelect} />}
      {screen === 'GAME_HUB' && <GameHub onNavigate={setScreen} />}
      {screen === 'GAME_CODE' && <CodeGame onComplete={handleGameComplete} />}
      {screen === 'GAME_MEMORY' && <MemoryGame onComplete={handleGameComplete} profile={profile} />}
      {screen === 'GAME_PUZZLE' && <PuzzleGame onComplete={handleGameComplete} />}
      {screen === 'GAME_CREATIVE' && <CreativeRoom onSave={handleSaveDrawing} savedDrawings={profile?.drawings || []} />}
    </Layout>
  );
};

export default App;