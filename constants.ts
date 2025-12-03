import { Character, Sticker } from './types';

export const CHARACTERS: Character[] = [
  { id: 'rabbit', name: 'Roketli Tavşan', emoji: '🐰', color: 'bg-pink-400', bgGradient: 'from-pink-300 to-purple-400' },
  { id: 'panda', name: 'Dedektif Panda', emoji: '🐼', color: 'bg-teal-400', bgGradient: 'from-teal-300 to-emerald-500' },
  { id: 'owl', name: 'Uzay Baykuşu', emoji: '🦉', color: 'bg-indigo-400', bgGradient: 'from-indigo-300 to-purple-500' },
  { id: 'robot', name: 'Renkçi Robot', emoji: '🤖', color: 'bg-orange-400', bgGradient: 'from-orange-300 to-red-400' },
];

export const STICKERS: Sticker[] = [
  { id: 'balloon', emoji: '🎈', name: 'Balon' },
  { id: 'heart', emoji: '💖', name: 'Kalp' },
  { id: 'star', emoji: '🌟', name: 'Yıldız' },
  { id: 'candy', emoji: '🍭', name: 'Şeker' },
  { id: 'unicorn', emoji: '🦄', name: 'Tek Boynuz' },
  { id: 'paw', emoji: '🐾', name: 'Pati' },
  { id: 'rainbow', emoji: '🌈', name: 'Gökkuşağı' },
  { id: 'sun', emoji: '🌞', name: 'Güneş' },
  { id: 'flower', emoji: '🌸', name: 'Çiçek' },
  { id: 'rocket', emoji: '🚀', name: 'Roket' },
];

export const GAME_TITLES = {
  CODE: "Şifre Oyunu",
  MEMORY: "Hafıza Oyunu",
  PUZZLE: "Yapboz",
  CREATIVE: "Oyun Odası"
};