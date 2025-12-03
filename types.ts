export type ScreenType = 
  | 'START' 
  | 'CHARACTER_CHOICE' 
  | 'GAME_HUB' 
  | 'GAME_CODE' 
  | 'GAME_MEMORY' 
  | 'GAME_PUZZLE' 
  | 'GAME_CREATIVE';

export interface Character {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgGradient: string;
}

export interface Profile {
  id: string;
  characterId: string;
  name: string;
  stars: number;
  stickers: string[];
  drawings: string[]; // Base64 strings
}

export interface SaveData {
  profiles: Record<string, Profile>;
  activeProfileId: string | null;
}

export interface Sticker {
  id: string;
  emoji: string;
  name: string;
}