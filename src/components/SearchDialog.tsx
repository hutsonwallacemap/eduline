import { BookMarked, BookOpen, ChevronRight, FileText, HelpCircle, Search, Sigma, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isOfficial, loadBank } from '../data/bank';
import { BOARD_PAPERS, CBSE_PAPERS, cbseClassFor } from '../data/cbseSqp';
import { subjectsFor } from '../data/curriculum';
import { formulasFor } from '../data/formulas';
import { LIBRARY } from '../data/library';
import { useApp } from '../store';
import type { Question } from '../types/quiz';
import MathText from './MathText';

const words = (q: string) => q.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
const has = (text: string, ws: string[]) => {
  const t = text.toLowerCase();
  return ws.every((w) => t.includes(w));
};

function Group({ icon: Icon, title, children }: { icon: typeof Search; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/** Site-wide search: chapters, questions with answers, library resources, formulas and CBSE papers. */
export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selectedGrade, selectedStream, setSubject, setChapter, setView, setOpenNote } = useApp();
  const [query, setQuery] = useState('');
  const [bank, setBank] = useState<Question[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 0);
    loadBank().then(setBank);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const ws = words(query);
  const results = useMemo(() => {
    if (!ws.length) return null;
    const subjects = subjectsFor(selectedGrade, selectedStream);
    const chapters = subjects.flatMap((s) => s.chapters.map((c) => ({ subject: s.name, chapter: c }))).filter((c) => has(`${c.subject} ${c.chapter}`, ws)).slice(0, 6);
    const questions = (bank ?? []).filter((q) => q.grade === selectedGrade && has(`${q.question} ${q.chapter} ${q.subject}`, ws)).slice(0, 6);
    const resources = LIBRARY.filter((r) => has(`${r.title} ${r.subject} ${r.chapter ?? ''} ${r.kind} ${r.source}`, ws)).slice(0, 6);
    const formulas = formulasFor(selectedGrade).filter((f) => has(`${f.name} ${f.subject} ${f.whenToUse}`, ws)).slice(0, 4);
    const cls = cbseClassFor(selectedGrade);
    const papers = [
      ...BOARD_PAPERS.filter((p) => p.cls === cls && p.exam === 'Main').map((p) => ({ key: `b${p.year}${p.subject}`, title: `${p.subject} — Board exam ${p.year}`, url: p.qp })),
      ...CBSE_PAPERS.filter((p) => p.cls === cls && p.sqp).map((p) => ({ key: `s${p.session}${p.subject}`, title: `${p.subject} — Sample paper ${p.session}`, url: p.sqp! })),
    ].filter((p) => has(p.title, ws)).slice(0, 5);
    return { chapters, questions, resources, formulas, papers };
  }, [ws.join(' '), bank, selectedGrade, selectedStream]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;
  const total = results ? Object.values(results).reduce((t, list) => t + list.length, 0) : 0;
  const go = (fn: () => void) => {
    fn();
    onClose();
  };
  const row = 'flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-[8vh]" onClick={onClose}>
      <div className="card flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search">
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search Class ${selectedGrade} chapters, questions, books, formulas, papers…`}
            className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none"
          />
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close search">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-3">
          {!results && <p className="px-1 py-6 text-center text-sm text-slate-500">Try “electricity”, “quadratic”, “Nationalism”, “Lencho” or “sample paper 2026”.</p>}
          {results && total === 0 && <p className="px-1 py-6 text-center text-sm text-slate-500">No results for “{query}”.</p>}

          {results && results.chapters.length > 0 && (
            <Group icon={BookMarked} title="Chapters">
              {results.chapters.map((c) => (
                <button key={c.subject + c.chapter} className={row} onClick={() => go(() => { setSubject(c.subject); setTimeout(() => setChapter(c.chapter), 0); setView('practice'); })}>
                  <span className="flex-1">{c.chapter} <span className="text-slate-500">· {c.subject}</span></span>
                  <span className="text-xs text-violet-600">Practise</span>
                </button>
              ))}
            </Group>
          )}

          {results && results.questions.length > 0 && (
            <Group icon={HelpCircle} title="Questions and answers">
              {results.questions.map((q) => (
                <div key={q.id} className="rounded-lg border border-slate-200 dark:border-slate-700">
                  <button className={row} onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                    <ChevronRight className={`h-4 w-4 shrink-0 text-slate-400 transition ${expanded === q.id ? 'rotate-90' : ''}`} />
                    <span className="line-clamp-2 flex-1"><MathText text={q.question} /></span>
                  </button>
                  {expanded === q.id && (
                    <div className="space-y-1 border-t border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
                      <div className="text-xs text-slate-500">{q.subject} · {q.chapter} · {q.source}</div>
                      {q.options && <div className="font-medium text-emerald-700 dark:text-emerald-300">Answer: <MathText text={q.options[Number(q.correctAnswer)]} /></div>}
                      <div className="text-xs font-semibold uppercase tracking-wide text-violet-600">{isOfficial(q) ? 'CBSE marking scheme' : 'Solution'}</div>
                      <div className="whitespace-pre-line"><MathText text={q.explanation || 'See the correct option above.'} /></div>
                    </div>
                  )}
                </div>
              ))}
            </Group>
          )}

          {results && results.resources.length > 0 && (
            <Group icon={BookOpen} title="Library">
              {results.resources.map((r) =>
                r.format === 'notes' ? (
                  <button key={r.id} className={row} onClick={() => go(() => setOpenNote(r.noteKey!))}>
                    <span className="flex-1">{r.title} <span className="text-slate-500">· {r.subject}</span></span>
                    <span className="text-xs text-violet-600">Read notes</span>
                  </button>
                ) : (
                  <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className={row} onClick={onClose}>
                    <span className="flex-1">{r.title} <span className="text-slate-500">· {r.kind}</span></span>
                    <span className="text-xs text-violet-600">{r.format === 'pdf' ? 'Read' : 'Open'}</span>
                  </a>
                ),
              )}
            </Group>
          )}

          {results && results.formulas.length > 0 && (
            <Group icon={Sigma} title="Formulas">
              {results.formulas.map((f) => (
                <button key={f.name} className={row} onClick={() => go(() => setView('revision'))}>
                  <span className="flex-1">{f.name} <span className="text-slate-500">· {f.subject}</span></span>
                  <span className="text-xs text-violet-600">Formula sheets</span>
                </button>
              ))}
            </Group>
          )}

          {results && results.papers.length > 0 && (
            <Group icon={FileText} title="CBSE papers">
              {results.papers.map((p) => (
                <a key={p.key} href={p.url} target="_blank" rel="noopener noreferrer" className={row} onClick={onClose}>
                  <span className="flex-1">{p.title}</span>
                  <span className="text-xs text-violet-600">Open</span>
                </a>
              ))}
            </Group>
          )}
        </div>
      </div>
    </div>
  );
}
