import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, QuizConfig } from './types/quiz';

export type Stream = 'General' | 'Science (PCM)' | 'Science (PCB)' | 'Commerce' | 'Humanities';
export type View = 'dashboard' | 'prep' | 'library' | 'doubts' | 'practice' | 'revision' | 'papers';

interface AppState {
  selectedBoard: Board;
  selectedGrade: number;
  selectedStream: Stream;
  /** Shared by Doubt Solver and Practice so Class -> Subject -> Chapter carries across views. */
  selectedSubject: string | null;
  selectedChapter: string;
  streak: number; // consecutive days with practice
  dailyTarget: number;
  dailyDone: number; // questions answered today
  lastPracticeDay: string | null; // YYYY-MM-DD
  theme: 'light' | 'dark';
  view: View;
  /** Pre-fills the practice configurator (from a subject card or a sample paper). */
  practicePreset: Partial<QuizConfig> | null;
  streamModalOpen: boolean;
  openNote: string | null; // "subject|chapter" of the chapter notes shown in the reader
  setOpenNote: (key: string | null) => void;
  /** A hosted PDF shown in the in-app reader. */
  openPdf: { title: string; url: string } | null;
  setOpenPdf: (pdf: { title: string; url: string } | null) => void;
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

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

/** Today's count and the streak, ignoring days that have passed since the last practice. */
export function progressToday(s: Pick<AppState, 'dailyDone' | 'streak' | 'lastPracticeDay'>) {
  const today = dayKey(new Date());
  const yesterday = dayKey(new Date(Date.now() - 86_400_000));
  return {
    done: s.lastPracticeDay === today ? s.dailyDone : 0,
    streak: s.lastPracticeDay === today || s.lastPracticeDay === yesterday ? s.streak : 0,
  };
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      selectedBoard: 'CBSE',
      selectedGrade: 10,
      selectedStream: 'General',
      selectedSubject: null,
      selectedChapter: '',
      streak: 0,
      dailyTarget: 20,
      dailyDone: 0,
      lastPracticeDay: null,
      theme: 'light',
      view: 'dashboard',
      practicePreset: null,
      streamModalOpen: false,
      openNote: null,
      setOpenNote: (openNote) => set({ openNote }),
      openPdf: null,
      setOpenPdf: (openPdf) => set({ openPdf }),
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
      logPractice: (n) =>
        set((s) => {
          if (n <= 0) return {};
          const today = dayKey(new Date());
          if (s.lastPracticeDay === today) return { dailyDone: s.dailyDone + n };
          const continued = s.lastPracticeDay === dayKey(new Date(Date.now() - 86_400_000));
          return { dailyDone: n, lastPracticeDay: today, streak: continued ? s.streak + 1 : 1 };
        }),
    }),
    {
      name: 'edugenie-state',
      version: 2,
      migrate: (persisted) => ({ ...(persisted as object), streak: 0, dailyDone: 0, lastPracticeDay: null }) as AppState,
      partialize: (s) => ({
        selectedBoard: s.selectedBoard,
        selectedGrade: s.selectedGrade,
        selectedStream: s.selectedStream,
        selectedSubject: s.selectedSubject,
        selectedChapter: s.selectedChapter,
        streak: s.streak,
        dailyDone: s.dailyDone,
        lastPracticeDay: s.lastPracticeDay,
        theme: s.theme,
      }),
    },
  ),
);

/** Tone tiers: Class 7–8 gamified, 9–10 board-focused, 11–12 academic with competitive-exam crossover. */
export const tierOf = (grade: number) => (grade <= 8 ? 'junior' : grade <= 10 ? 'secondary' : 'senior');
