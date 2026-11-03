import { BadgeCheck, BookOpen, Download, FileText, Globe, Info, Library as LibraryIcon, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import SubjectIcon from '../components/SubjectIcon';
import { subjectsFor } from '../data/curriculum';
import { hostOf, LIBRARY, RESOURCE_KINDS, type Resource, type ResourceKind } from '../data/library';
import { useApp } from '../store';

const KIND_TINT: Record<ResourceKind, string> = {
  'EduGenie Notes': 'bg-violet-600 text-white',
  'NCERT Textbook': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  'NCERT Exemplar': 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
  'CBSE Syllabus': 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  Notes: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
  'Mind Map': 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300',
  'Important Questions': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  'NCERT Solutions': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
  'Learning Platform': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

function ResourceCard({ r }: { r: Resource }) {
  const setOpenNote = useApp((s) => s.setOpenNote);
  return (
    <div className="card flex flex-col p-4">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className={`chip ${KIND_TINT[r.kind]}`}>{r.kind}</span>
        {r.official && (
          <span className="chip bg-emerald-600 text-white"><BadgeCheck className="h-3 w-3" /> Official</span>
        )}
        {r.format === 'pdf' && <span className="chip bg-slate-100 dark:bg-slate-800"><FileText className="h-3 w-3" /> PDF{r.pages ? ` · ${r.pages} pages` : ''}</span>}
      </div>
      <h3 className="font-medium leading-snug">{r.title}</h3>
      <p className="mt-1 flex-1 text-sm text-slate-500">{r.description}</p>
      <div className="mt-2 text-xs text-slate-500">
        {r.format === 'notes' ? 'Original EduGenie notes · CBSE 2026-27 syllabus' : `${r.source} · ${hostOf(r.url)}${r.year ? ` · ${r.year}` : ''}`}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {r.format === 'notes' ? (
          <button onClick={() => setOpenNote(r.noteKey!)} className="btn-primary !px-3 !py-1.5">
            <BookOpen className="h-4 w-4" /> Read notes
          </button>
        ) : (
        <>
        <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-primary !px-3 !py-1.5">
          {r.format === 'pdf' ? <BookOpen className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
          {r.format === 'pdf' ? 'Read online' : 'Open page'}
        </a>
        {r.format === 'pdf' && (
          <a href={r.url} download target="_blank" rel="noopener noreferrer" className="btn-ghost !px-3 !py-1.5">
            <Download className="h-4 w-4" /> Download
          </a>
        )}
        </>
        )}
      </div>
    </div>
  );
}

export default function Library() {
  const { selectedGrade } = useApp();
  const subjects = subjectsFor(10, 'General');
  const [subject, setSubject] = useState<string>('All');
  const [kind, setKind] = useState<ResourceKind | 'All'>('All');
  const [chapter, setChapter] = useState('All');
  const [officialOnly, setOfficialOnly] = useState(false);
  const [query, setQuery] = useState('');

  const chapters = subject === 'All' ? [] : (subjects.find((s) => s.name === subject)?.chapters ?? []);
  const list = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return LIBRARY.filter(
      (r) =>
        (subject === 'All' || r.subject === subject || r.subject === 'All subjects') &&
        (kind === 'All' || r.kind === kind) &&
        (chapter === 'All' || r.chapter === chapter) &&
        (!officialOnly || r.official) &&
        words.every((w) => `${r.title} ${r.subject} ${r.chapter ?? ''} ${r.kind} ${r.source}`.toLowerCase().includes(w)),
    );
  }, [subject, kind, chapter, officialOnly, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of LIBRARY) c[r.kind] = (c[r.kind] ?? 0) + 1;
    return c;
  }, []);

  const pill = (active: boolean) =>
    `chip cursor-pointer border py-1 transition ${
      active ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
    }`;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-sky-600 to-indigo-700 p-6 text-white sm:p-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-white/80"><LibraryIcon className="h-4 w-4" /> Digital Library</div>
        <h1 className="text-2xl font-bold sm:text-3xl">Every Class 10 book, syllabus and notes page in one place</h1>
        <p className="mt-2 max-w-2xl text-white/85">
          {LIBRARY.length} resources: EduGenie’s own chapter notes, NCERT textbooks and exemplars, the CBSE 2026-27 syllabus, and free notes and mind maps from publishers — filtered by subject and chapter.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {RESOURCE_KINDS.filter((k) => counts[k]).map((k) => (
            <span key={k} className="chip bg-white/15">{counts[k]} {k}</span>
          ))}
        </div>
      </section>

      {selectedGrade !== 10 && (
        <div className="flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-500/10 dark:text-sky-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" /> The library currently covers Class 10. Board papers for Class 12 are in Sample Papers.
        </div>
      )}

      <section className="card space-y-4 p-4">
        <div className="flex items-center rounded-xl border border-slate-200 px-3 dark:border-slate-700">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books, chapters, notes…" className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none" />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search" className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
          )}
        </div>
        <div>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            <button onClick={() => { setSubject('All'); setChapter('All'); }} className={pill(subject === 'All')}>All subjects</button>
            {subjects.map((s) => (
              <button key={s.name} onClick={() => { setSubject(s.name); setChapter('All'); }} className={`${pill(subject === s.name)} shrink-0`}>
                <SubjectIcon name={s.icon} className="h-3.5 w-3.5" /> {s.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="select" value={kind} onChange={(e) => setKind(e.target.value as ResourceKind | 'All')} aria-label="Resource type">
            <option value="All">All resource types</option>
            {RESOURCE_KINDS.filter((k) => counts[k]).map((k) => <option key={k}>{k}</option>)}
          </select>
          {chapters.length > 0 && (
            <select className="select max-w-full" value={chapter} onChange={(e) => setChapter(e.target.value)} aria-label="Chapter">
              <option value="All">All chapters</option>
              {chapters.map((c) => <option key={c}>{c}</option>)}
            </select>
          )}
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={officialOnly} onChange={(e) => setOfficialOnly(e.target.checked)} className="accent-violet-600" />
            Official NCERT / CBSE only
          </label>
          <span className="ml-auto text-sm text-slate-500">{list.length} results</span>
        </div>
      </section>

      {list.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          <Search className="mx-auto mb-2 h-8 w-8 text-slate-300" />
          No resources match these filters. Try another subject or clear the search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => <ResourceCard key={r.id} r={r} />)}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Official PDFs open on ncert.nic.in and cbseacademic.nic.in, which don’t allow their files to be shown inside other websites. Notes, mind maps and solutions are free pages from their publishers (PW, Oswaal, Educart, EduRev) and belong to them; EduGenie links to them and is not affiliated.
      </p>
    </div>
  );
}
