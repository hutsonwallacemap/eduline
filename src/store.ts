import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, QuizConfig } from './types/quiz';

export type Stream = 'General' | 'Science (PCM)' | 'Science (PCB)' | 'Commerce' | 'Humanities';
export type View = 'dashboard' | 'doubts' | 'practice' | 'revision' | 'papers';

interface AppState {
  selectedBoard: Board;
  selectedGrade: number;
  selectedStream: Stream;
  /** Shared by Doubt Solver and Practice so Class -> Subject -> Chapter carries across views. */
  selectedSubject: string | null;
  selectedChapter: string;
  streak: number;
  dailyTarget: number;
  dailyDone: number;
  theme: 'light' | 'dark';
  view: View;
  /** Pre-fills the practice configurator (from a subject card or a sample paper). */
  practicePreset: Partial<QuizConfig> | null;
  streamModalOpen: boolean;
  setBoard: (b: Board) => void;
  setGrade: (g: number) => void;
  setStream: (s: Stream) => void;
  setSubject: (s: string | null) => void;
  setChapter: (c: string) => void;
  setView: (v: View, preset?: Partial<QuizConfig> | null) => void;
  setStreamModalOpen: (open: boolean) => void;
  toggleTheme: () => void;
  logPractice: (n: number) => void;
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      selectedBoard: 'CBSE',
      selectedGrade: 10,
      selectedStream: 'General',
      selectedSubject: null,
      selectedChapter: '',
      streak: 7,
      dailyTarget: 20,
      dailyDone: 8,
      theme: 'light',
      view: 'dashboard',
      practicePreset: null,
      streamModalOpen: false,
      setBoard: (selectedBoard) => set({ selectedBoard }),
      setGrade: (selectedGrade) =>
        set((s) => {
          // Chapters differ by class, so a new class clears the subject/chapter pick.
          const reset = { selectedGrade, selectedSubject: null, selectedChapter: '' };
          if (selectedGrade <= 10) return { ...reset, selectedStream: 'General', streamModalOpen: false };
          // Senior secondary needs a stream; keep an existing one, otherwise ask.
          return s.selectedStream === 'General' ? { ...reset, streamModalOpen: true } : reset;
        }),
      setStream: (selectedStream) => set({ selectedStream, streamModalOpen: false, selectedSubject: null, selectedChapter: '' }),
      setSubject: (selectedSubject) =>
        set((s) => (s.selectedSubject === selectedSubject ? {} : { selectedSubject, selectedChapter: '' })),
      setChapter: (selectedChapter) => set({ selectedChapter }),
      setView: (view, practicePreset = null) => {
        set({ view, practicePreset });
        window.scrollTo({ top: 0 });
      },
      setStreamModalOpen: (streamModalOpen) => set({ streamModalOpen }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      logPractice: (n) => set((s) => ({ dailyDone: s.dailyDone + n })),
    }),
    {
      name: 'edugenie-state',
      partialize: (s) => ({
        selectedBoard: s.selectedBoard,
        selectedGrade: s.selectedGrade,
        selectedStream: s.selectedStream,
        selectedSubject: s.selectedSubject,
        selectedChapter: s.selectedChapter,
        streak: s.streak,
        dailyDone: s.dailyDone,
        theme: s.theme,
      }),
    },
  ),
);

/** Tone tiers: Class 7–8 gamified, 9–10 board-focused, 11–12 academic with competitive-exam crossover. */
export const tierOf = (grade: number) => (grade <= 8 ? 'junior' : grade <= 10 ? 'secondary' : 'senior');
