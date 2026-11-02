import { BookMarked, ChevronDown, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ALL_CHAPTERS, chapterCounts, MIXED_CHAPTER } from '../data/bank';
import { subjectsFor, type Subject } from '../data/curriculum';
import { useApp } from '../store';
import SubjectIcon from './SubjectIcon';

/** Current subject object for the selected class/stream, or null when none is chosen. */
export function useSelectedSubject(): Subject | null {
  const { selectedGrade, selectedStream, selectedSubject } = useApp();
  return useMemo(
    () => subjectsFor(selectedGrade, selectedStream).find((s) => s.name === selectedSubject) ?? null,
    [selectedGrade, selectedStream, selectedSubject],
  );
}

/**
 * Class -> Subject -> Chapter selector shared by the Doubt Solver and Practice.
 * The chapter box accepts any typed name (ICSE / State books differ) and suggests NCERT chapters.
 */
export default function SubjectChapterPicker({ compact = false }: { compact?: boolean }) {
  const { selectedBoard, selectedGrade, selectedStream, selectedSubject, selectedChapter, setSubject, setChapter } = useApp();
  const subjects = subjectsFor(selectedGrade, selectedStream);
  const subject = subjects.find((s) => s.name === selectedSubject) ?? null;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(selectedChapter);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [counts, setCounts] = useState<{ counts: Record<string, number>; total: number } | null>(null);

  // Question counts from the CBSE bank, so students can see which chapters have board questions.
  useEffect(() => {
    let live = true;
    setCounts(null);
    if (selectedSubject) chapterCounts(selectedGrade, selectedSubject).then((c) => live && setCounts(c));
    return () => {
      live = false;
    };
  }, [selectedGrade, selectedSubject]);

  useEffect(() => {
    setDraft(selectedChapter);
  }, [selectedChapter]);

  // Close the suggestion list on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const suggestions = useMemo(() => {
    const q = draft.trim().toLowerCase();
    const extra = counts?.total ? [ALL_CHAPTERS, ...(counts.counts[MIXED_CHAPTER] ? [MIXED_CHAPTER] : [])] : [];
    const all = [...extra, ...(subject?.chapters ?? [])];
    return q && !all.some((c) => c.toLowerCase() === q) ? all.filter((c) => c.toLowerCase().includes(q)) : all;
  }, [draft, subject, counts]);

  const countFor = (c: string) => (c === ALL_CHAPTERS ? counts?.total : counts?.counts[c]) ?? 0;

  const commit = (value: string) => {
    setDraft(value);
    setChapter(value.trim());
    setOpen(false);
  };

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <div>
        <div className="mb-1.5 text-sm font-medium">Subject <span className="font-normal text-slate-500">· Class {selectedGrade}</span></div>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <button
              key={s.name}
              onClick={() => {
                setSubject(s.name);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm transition ${
                s.name === selectedSubject
                  ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300'
                  : 'border-slate-200 hover:border-violet-300 dark:border-slate-700'
              }`}
            >
              <SubjectIcon name={s.icon} className="h-4 w-4" /> {s.name}
            </button>
          ))}
        </div>
      </div>

      {subject && (
        <div ref={boxRef} className="relative">
          <label htmlFor={listId} className="mb-1.5 block text-sm font-medium">
            Chapter <span className="font-normal text-slate-500">· type your chapter name or pick a suggestion</span>
          </label>
          <div className={`flex items-center rounded-xl border bg-white dark:bg-slate-900 ${selectedChapter ? 'border-slate-200 dark:border-slate-700' : 'border-violet-400 ring-2 ring-violet-100 dark:ring-violet-500/20'}`}>
            <BookMarked className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
            <input
              id={listId}
              ref={inputRef}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setChapter(draft.trim())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit(suggestions.length === 1 ? suggestions[0] : draft);
                if (e.key === 'Escape') setOpen(false);
              }}
              placeholder={`e.g. ${subject.chapters[0] ?? 'Chapter name'}`}
              className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none"
              role="combobox"
              aria-expanded={open}
              aria-autocomplete="list"
            />
            {draft && (
              <button onClick={() => commit('')} className="p-1 text-slate-400 hover:text-slate-600" aria-label="Clear chapter">
                <X className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => setOpen(!open)} className="px-3 py-2 text-slate-400 hover:text-slate-600" aria-label="Show chapter suggestions">
              <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {open && (
            <ul role="listbox" className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {suggestions.map((c) => (
                <li key={c}>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(c)}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-violet-50 dark:hover:bg-violet-500/10 ${c === selectedChapter ? 'font-medium text-violet-700 dark:text-violet-300' : ''}`}
                  >
                    <span className="flex-1">{c}</span>
                    {counts && countFor(c) > 0 && (
                      <span className="chip bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{countFor(c)} Qs</span>
                    )}
                  </button>
                </li>
              ))}
              {draft.trim() && !subject.chapters.some((c) => c.toLowerCase() === draft.trim().toLowerCase()) && (
                <li>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => commit(draft)} className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10">
                    Use “{draft.trim()}”
                  </button>
                </li>
              )}
              {!suggestions.length && !draft.trim() && <li className="px-3 py-2 text-sm text-slate-500">Type your chapter name.</li>}
            </ul>
          )}
          {selectedBoard !== 'CBSE' && (
            <p className="mt-1 text-xs text-slate-500">Suggestions follow NCERT. {selectedBoard} books differ — type your chapter name if it isn’t listed.</p>
          )}
        </div>
      )}
      {!subject && <p className="text-sm text-violet-700 dark:text-violet-300">Choose a subject to continue.</p>}
      {subject && !selectedChapter && <p className="text-sm text-violet-700 dark:text-violet-300">Now choose or type the chapter for {subject.name}.</p>}
    </div>
  );
}
