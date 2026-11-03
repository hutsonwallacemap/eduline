import { Flame, Moon, Search, Sparkles, Sun, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import SearchDialog from './SearchDialog';
import { progressToday, useApp, type View } from '../store';
import type { Board } from '../types/quiz';

const NAV: { view: View; label: string }[] = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'prep', label: 'Board Prep' },
  { view: 'library', label: 'Library' },
  { view: 'doubts', label: 'Doubt Solver' },
  { view: 'practice', label: 'Practice' },
  { view: 'revision', label: 'Formula Sheets' },
  { view: 'papers', label: 'Sample Papers' },
];

export default function Header() {
  const s = useApp();
  const { streak } = progressToday(s);
  const [searchOpen, setSearchOpen] = useState(false);

  // "/" opens search from anywhere except while typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement;
      if (e.key === '/' && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button onClick={() => s.setView('dashboard')} className="flex shrink-0 cursor-pointer items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight sm:block">
            EduGenie <span className="text-violet-600 dark:text-violet-400">AI</span>
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <select
            aria-label="Board"
            className="select"
            value={s.selectedBoard}
            onChange={(e) => s.setBoard(e.target.value as Board)}
          >
            <option>CBSE</option>
            <option>ICSE</option>
            <option>State Board</option>
          </select>
          <select
            aria-label="Class"
            className="select"
            value={s.selectedGrade}
            onChange={(e) => s.setGrade(Number(e.target.value))}
          >
            {[7, 8, 9, 10, 11, 12].map((g) => (
              <option key={g} value={g}>Class {g}</option>
            ))}
          </select>
          {s.selectedGrade >= 11 && (
            <button onClick={() => s.setStreamModalOpen(true)} className="btn-ghost hidden !px-2.5 !py-1.5 md:inline-flex">
              <GraduationCap className="h-4 w-4" /> {s.selectedStream}
            </button>
          )}
          {streak > 0 && (
            <span className="chip bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" title={`${streak}-day practice streak`}>
              <Flame className="h-3.5 w-3.5" /> {streak}
            </span>
          )}
          <button onClick={() => setSearchOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Search" title="Search (press /)">
            <Search className="h-4 w-4" />
          </button>
          <button onClick={s.toggleTheme} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">
            {s.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <nav className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2">
        {NAV.map((n) => (
          <button
            key={n.view}
            onClick={() => s.setView(n.view)}
            className={`shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              s.view === n.view
                ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {n.label}
          </button>
        ))}
      </nav>
    </header>
    <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
