import { ChevronLeft, ChevronRight, FileText, Printer, RotateCw, Shuffle, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import MathText from '../components/MathText';
import { formulasFor } from '../data/formulas';
import { useApp } from '../store';

export default function Revision() {
  const { selectedGrade, selectedBoard } = useApp();
  const all = useMemo(() => formulasFor(selectedGrade), [selectedGrade]);
  const subjects = useMemo(() => ['All', ...new Set(all.map((f) => f.subject))], [all]);
  const [subject, setSubject] = useState('All');
  const [order, setOrder] = useState<number[]>([]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const cards = useMemo(() => all.filter((f) => subject === 'All' || f.subject === subject), [all, subject]);
  useEffect(() => { setOrder(cards.map((_, k) => k)); setI(0); setFlipped(false); }, [cards]);

  const card = cards[order[i] ?? 0];
  const move = (d: number) => { setFlipped(false); setI((x) => (x + d + cards.length) % cards.length); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (sheetOpen) return;
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-lg font-semibold">Formula & Revision Toolkit</h1>
        <div className="flex flex-wrap gap-1.5">
          {subjects.map((s) => (
            <button key={s} onClick={() => setSubject(s)} className={`chip cursor-pointer py-1 ${s === subject ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{s}</button>
          ))}
        </div>
        <button onClick={() => setSheetOpen(true)} className="btn-primary"><FileText className="h-4 w-4" /> Cheat sheet</button>
      </div>

      {card && (
        <div className="mx-auto max-w-xl">
          <div className="flip h-72 cursor-pointer select-none" onClick={() => setFlipped(!flipped)}>
            <div className={`flip-inner relative h-full ${flipped ? 'flipped' : ''}`}>
              <div className="flip-face absolute inset-0 grid place-items-center rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-center text-white shadow-lg">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">{card.subject}</div>
                  <div className="mt-2 text-2xl font-bold">{card.name}</div>
                  <div className="mt-6 inline-flex items-center gap-1 text-sm text-white/70"><RotateCw className="h-4 w-4" /> Tap or press Space to flip</div>
                </div>
              </div>
              <div className="flip-face flip-back card absolute inset-0 flex flex-col justify-center gap-3 p-6">
                <div className="text-lg"><MathText text={card.equation} /></div>
                <div className="text-sm"><span className="font-semibold text-violet-600">Units: </span><MathText text={card.units} /></div>
                <div className="text-sm"><span className="font-semibold text-violet-600">When to use: </span><MathText text={card.whenToUse} /></div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button onClick={() => move(-1)} className="btn-ghost !px-3" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
            <span className="w-16 text-center text-sm text-slate-500">{i + 1} / {cards.length}</span>
            <button onClick={() => move(1)} className="btn-ghost !px-3" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
            <button onClick={() => { setOrder((o) => [...o].sort(() => Math.random() - 0.5)); setI(0); setFlipped(false); }} className="btn-ghost !px-3" aria-label="Shuffle"><Shuffle className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {sheetOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" onClick={() => setSheetOpen(false)}>
          <div className="card max-h-[85vh] w-full max-w-3xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center gap-2 border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold">Exam-day cheat sheet</h2>
              <button onClick={() => window.print()} className="btn-ghost ml-auto !py-1.5"><Printer className="h-4 w-4" /> Print / Save PDF</button>
              <button onClick={() => setSheetOpen(false)} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div id="print-area" className="p-6">
              <h3 className="text-center text-lg font-bold">{selectedBoard} Class {selectedGrade} — {subject === 'All' ? 'All subjects' : subject}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {cards.map((f) => (
                  <div key={f.name} className="break-inside-avoid rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                    <div className="text-sm font-semibold">{f.name} <span className="font-normal text-slate-400">· {f.subject}</span></div>
                    <MathText text={f.equation} />
                    <div className="text-xs text-slate-500"><MathText text={f.whenToUse} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
