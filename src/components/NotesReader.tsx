import { BookOpen, CheckCircle2, ExternalLink, PenLine, Printer, Sigma, Target, X } from 'lucide-react';
import { useEffect } from 'react';
import { ncertChapter } from '../data/library';
import { NOTES } from '../data/notes';
import { useApp } from '../store';
import MathText from './MathText';

/** In-app reader for EduGenie's original chapter notes; opened from Library, Board Prep and search. */
export default function NotesReader() {
  const { openNote, setOpenNote, setSubject, setChapter, setView } = useApp();
  const note = openNote ? NOTES.find((n) => `${n.subject}|${n.chapter}` === openNote) : null;

  useEffect(() => {
    if (!note) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenNote(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [note, setOpenNote]);

  if (!note) return null;
  const ncert = ncertChapter(10, note.subject, note.chapter);
  const title = note.chapter.includes(': ') ? note.chapter.split(': ')[1] : note.chapter;
  const hi = note.subject === 'Hindi';
  const L = hi
    ? { key: 'मुख्य बिंदु', formulas: 'सूत्र', terms: 'प्रमुख शब्द', exam: 'परीक्षा की दृष्टि से' }
    : { key: 'Key points', formulas: 'Formulas', terms: 'Key terms', exam: 'Exam focus' };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" onClick={() => setOpenNote(null)}>
      <article className="card flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden" onClick={(e) => e.stopPropagation()} aria-label={`${title} notes`}>
        <header className="flex items-start gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium uppercase tracking-wide text-violet-600">EduGenie notes · Class 10 {note.subject}</div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <button onClick={() => window.print()} className="btn-ghost !px-3 !py-1.5"><Printer className="h-4 w-4" /> Print</button>
          <button onClick={() => setOpenNote(null)} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close notes"><X className="h-5 w-5" /></button>
        </header>

        <div id="print-area" className="flex-1 space-y-5 overflow-y-auto px-5 py-5 text-sm leading-relaxed">
          <h2 className="hidden text-lg font-bold print:block">{note.subject} — {title}</h2>
          <p className="rounded-xl bg-violet-50 p-4 text-base dark:bg-violet-500/10"><MathText text={note.overview} /></p>

          <section>
            <h3 className="mb-2 flex items-center gap-2 font-semibold"><BookOpen className="h-4 w-4 text-emerald-600" /> {L.key}</h3>
            <ul className="space-y-2">
              {note.keyPoints.map((p, i) => (
                <li key={i} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span><MathText text={p} /></span></li>
              ))}
            </ul>
          </section>

          {note.formulas && (
            <section>
              <h3 className="mb-2 flex items-center gap-2 font-semibold"><Sigma className="h-4 w-4 text-indigo-600" /> {L.formulas}</h3>
              <div className="space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                {note.formulas.map((f, i) => <div key={i}><MathText text={f} /></div>)}
              </div>
            </section>
          )}

          {note.terms && (
            <section>
              <h3 className="mb-2 font-semibold">{L.terms}</h3>
              <dl className="grid gap-2 sm:grid-cols-2">
                {note.terms.map((t) => (
                  <div key={t.term} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
                    <dt className="font-semibold">{t.term}</dt>
                    <dd className="text-slate-600 dark:text-slate-300">{t.meaning}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section>
            <h3 className="mb-2 flex items-center gap-2 font-semibold"><Target className="h-4 w-4 text-amber-500" /> {L.exam}</h3>
            <ul className="space-y-2">
              {note.examFocus.map((p, i) => (
                <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /><span><MathText text={p} /></span></li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-800">
          <button
            onClick={() => {
              setSubject(note.subject);
              setTimeout(() => setChapter(note.chapter), 0);
              setOpenNote(null);
              setView('practice');
            }}
            className="btn-primary !px-3 !py-1.5"
          >
            <PenLine className="h-4 w-4" /> Practise this chapter
          </button>
          {ncert && (
            <a href={ncert.url} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-3 !py-1.5">
              NCERT chapter <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <span className="ml-auto text-xs text-slate-500">Original notes written for EduGenie, based on the CBSE 2026-27 syllabus.</span>
        </footer>
      </article>
    </div>
  );
}
