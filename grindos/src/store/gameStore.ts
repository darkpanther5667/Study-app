import { create } from 'zustand';

interface BattlePlayer {
  id: string;
  name: string;
  score: number;
}

interface BattleQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface GameState {
  // Battle state
  currentRoomId: string | null;
  isInBattle: boolean;
  currentQuestionIndex: number;
  questions: BattleQuestion[];
  players: BattlePlayer[];
  timeRemaining: number;

  // Actions
  setCurrentRoom: (roomId: string | null) => void;
  startBattle: (roomId: string, questions: BattleQuestion[], players: BattlePlayer[]) => void;
  endBattle: () => void;
  nextQuestion: () => void;
  updateScore: (playerId: string, points: number) => void;
  setTimeRemaining: (time: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentRoomId: null,
  isInBattle: false,
  currentQuestionIndex: 0,
  questions: [],
  players: [],
  timeRemaining: 10,

  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),

  startBattle: (roomId, questions, players) => set({
    currentRoomId: roomId,
    isInBattle: true,
    currentQuestionIndex: 0,
    questions,
    players,
    timeRemaining: 10,
  }),

  endBattle: () => set({
    isInBattle: false,
    currentQuestionIndex: 0,
    questions: [],
    timeRemaining: 10,
  }),

  nextQuestion: () => set((state) => ({
    currentQuestionIndex: state.currentQuestionIndex + 1,
    timeRemaining: 10,
  })),

  updateScore: (playerId, points) => set((state) => ({
    players: state.players.map((p) =>
      p.id === playerId ? { ...p, score: p.score + points } : p
    ),
  })),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  resetGame: () => set({
    currentRoomId: null,
    isInBattle: false,
    currentQuestionIndex: 0,
    questions: [],
    players: [],
    timeRemaining: 10,
  }),
}));