import { ExternalLink, FileCheck2, FileText, Info, Search, Timer } from 'lucide-react';
import { useMemo, useState } from 'react';
import OfficialResources from '../components/OfficialResources';
import { CBSE_PAPERS, CBSE_SESSIONS, cbseClassFor, matchesSubject, type CbsePaper } from '../data/cbseSqp';
import { subjectsFor } from '../data/curriculum';
import { useApp } from '../store';

const pdfBtn = 'btn-ghost !px-3 !py-1.5';

function PdfLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={pdfBtn}>
      {children}
      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
    </a>
  );
}

export default function Papers() {
  const { selectedGrade, selectedStream, setView } = useApp();
  const mySubjects = useMemo(() => subjectsFor(selectedGrade, selectedStream), [selectedGrade, selectedStream]);
  const [cls, setCls] = useState<'X' | 'XII'>(cbseClassFor(selectedGrade));
  const [session, setSession] = useState(CBSE_SESSIONS[0]);
  const [onlyMine, setOnlyMine] = useState(true);
  const [query, setQuery] = useState('');

  // "My subjects" only makes sense for the class the student is in.
  const myClass = cbseClassFor(selectedGrade) === cls && (selectedGrade === 10 || selectedGrade === 12);
  const appSubjectOf = (p: CbsePaper) => mySubjects.find((s) => matchesSubject(s.name, p.subject))?.name;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CBSE_PAPERS.filter(
      (p) =>
        p.cls === cls &&
        p.session === session &&
        (!q || p.subject.toLowerCase().includes(q)) &&
        (!onlyMine || !myClass || mySubjects.some((s) => matchesSubject(s.name, p.subject))),
    ).sort((a, b) => a.subject.localeCompare(b.subject));
  }, [cls, session, query, onlyMine, myClass, mySubjects]);

  const pill = (active: boolean) =>
    `chip cursor-pointer border py-1 transition ${
      active ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
    }`;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Sample Papers Vault</h1>
      <OfficialResources />

      <section className="card p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">CBSE Sample Question Papers & Marking Schemes</h2>
          <span className="text-sm text-slate-500">{list.length} papers · from cbseacademic.nic.in</span>
        </div>

        {selectedGrade !== 10 && selectedGrade !== 12 && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-500/10 dark:text-sky-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            CBSE publishes sample question papers for Class 10 and Class 12 board exams only. Showing Class {cls === 'X' ? '10' : '12'} papers; use Practice for Class {selectedGrade} chapter tests.
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5">
            {(['X', 'XII'] as const).map((c) => (
              <button key={c} onClick={() => setCls(c)} className={pill(cls === c)}>Class {c === 'X' ? '10' : '12'}</button>
            ))}
          </div>
          <select className="select" value={session} onChange={(e) => setSession(e.target.value)} aria-label="Session">
            {CBSE_SESSIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
          {myClass && (
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} className="accent-violet-600" />
              Only my subjects
            </label>
          )}
          <div className="flex min-w-[180px] flex-1 items-center rounded-lg border border-slate-200 px-2 dark:border-slate-700">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subject…" className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm outline-none" />
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {list.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No papers match. Try another session or clear the search.</p>}
          {list.map((p) => {
            const appSubject = myClass ? appSubjectOf(p) : undefined;
            return (
              <div key={`${p.cls}-${p.session}-${p.subject}`} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{p.subject}</div>
                  <div className="text-xs text-slate-500">CBSE Class {p.cls} · {p.session}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.sqp && <PdfLink href={p.sqp}><FileText className="h-4 w-4" /> Question Paper</PdfLink>}
                  {p.ms && <PdfLink href={p.ms}><FileCheck2 className="h-4 w-4" /> Marking Scheme</PdfLink>}
                  {p.sqpHindi && <PdfLink href={p.sqpHindi}>प्रश्न पत्र</PdfLink>}
                  {p.msHindi && <PdfLink href={p.msHindi}>अंकन योजना</PdfLink>}
                  {appSubject && (
                    <button onClick={() => setView('practice', { subject: appSubject, timeLimitMinutes: 30 })} className="btn-primary !px-3 !py-1.5">
                      <Timer className="h-4 w-4" /> Timed practice
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">PDFs open on cbseacademic.nic.in. Links were collected from CBSE’s SQP pages; if one moves, use the CBSE Academic card above.</p>
      </section>
    </div>
  );
}
