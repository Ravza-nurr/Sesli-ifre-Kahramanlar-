import { SaveData, Profile, Character } from '../types';
import { CHARACTERS } from '../constants';

const STORAGE_KEY = 'sesli_sifre_save_v1';

const initialData: SaveData = {
  profiles: {},
  activeProfileId: null,
};

export const loadData = (): SaveData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load save data", e);
  }
  return initialData;
};

export const saveData = (data: SaveData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

export const createProfile = (charId: string): Profile => {
  const char = CHARACTERS.find(c => c.id === charId) || CHARACTERS[0];
  return {
    id: Date.now().toString(),
    characterId: charId,
    name: char.name,
    stars: 0,
    stickers: [],
    drawings: []
  };
};