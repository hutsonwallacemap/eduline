import { ExternalLink, FileArchive, FileCheck2, FileText, Info, Search, Timer } from 'lucide-react';
import { useMemo, useState } from 'react';
import { HostedPdfButtons } from '../components/HostedPdfList';
import OfficialResources from '../components/OfficialResources';
import { BOARD_PAPERS, BOARD_YEARS, CBSE_PAPERS, CBSE_SESSIONS, cbseClassFor, matchesSubject } from '../data/cbseSqp';
import { subjectsFor } from '../data/curriculum';
import { HOSTED } from '../data/library';
import { useApp } from '../store';

type Tab = 'board' | 'sqp';

function PdfLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-3 !py-1.5">
      {children}
      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
    </a>
  );
}

const isZip = (url: string) => url.toLowerCase().endsWith('.zip');

/** Copies of CBSE papers hosted on this site, shown as "read here" buttons on the matching rows. */
const HOSTED_BOARD: Record<string, string> = { 'English Literature': 'English', 'Mathematics Standard': 'Mathematics' }; // 2026 main exam, Class X
const HOSTED_SQP: Record<string, string> = { 'Mathematics (Standard)': 'Mathematics', Science: 'Science', 'English (Language & Literature)': 'English', 'Hindi A': 'Hindi' }; // 2026-27
const hosted = (kind: string, subject: string | undefined, year: string) =>
  subject ? HOSTED.filter((r) => r.kind === kind && r.subject === subject && r.year === year) : [];

export default function Papers() {
  const { selectedGrade, selectedStream, setView } = useApp();
  const mySubjects = useMemo(() => subjectsFor(selectedGrade, selectedStream), [selectedGrade, selectedStream]);
  const [tab, setTab] = useState<Tab>('board');
  const [cls, setCls] = useState<'X' | 'XII'>(cbseClassFor(selectedGrade));
  const [session, setSession] = useState(CBSE_SESSIONS[0]);
  const [year, setYear] = useState(BOARD_YEARS[0]);
  const [exam, setExam] = useState<'Main' | 'Compartment'>('Main');
  const [onlyMine, setOnlyMine] = useState(true);
  const [query, setQuery] = useState('');

  // "My subjects" only makes sense for the class the student is in.
  const myClass = cbseClassFor(selectedGrade) === cls && (selectedGrade === 10 || selectedGrade === 12);
  const appSubjectOf = (cbseSubject: string) => mySubjects.find((s) => matchesSubject(s.name, cbseSubject))?.name;
  const keep = (subject: string) =>
    (!query.trim() || subject.toLowerCase().includes(query.trim().toLowerCase())) && (!onlyMine || !myClass || !!appSubjectOf(subject));

  const sqpList = useMemo(
    () => CBSE_PAPERS.filter((p) => p.cls === cls && p.session === session && keep(p.subject)).sort((a, b) => a.subject.localeCompare(b.subject)),
    [cls, session, query, onlyMine, myClass, mySubjects], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const boardList = useMemo(
    () => BOARD_PAPERS.filter((p) => p.cls === cls && p.year === year && p.exam === exam && keep(p.subject)).sort((a, b) => a.subject.localeCompare(b.subject)),
    [cls, year, exam, query, onlyMine, myClass, mySubjects], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const pill = (active: boolean) =>
    `chip cursor-pointer border py-1 transition ${
      active ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
    }`;
  const count = tab === 'board' ? boardList.length : sqpList.length;

  const practice = (subject: string | undefined) =>
    subject && (
      <button onClick={() => setView('practice', { subject, timeLimitMinutes: 30 })} className="btn-primary !px-3 !py-1.5">
        <Timer className="h-4 w-4" /> Timed practice
      </button>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Sample Papers Vault</h1>
      <OfficialResources />

      <section className="card p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 p-1 dark:border-slate-700">
            {([['board', 'Board exam papers 2022–2026'], ['sqp', 'Sample papers & marking schemes']] as const).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition ${tab === t ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-slate-500">{count} papers · CBSE</span>
        </div>

        {selectedGrade !== 10 && selectedGrade !== 12 && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-500/10 dark:text-sky-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            CBSE holds board exams and publishes papers for Class 10 and Class 12 only. Showing Class {cls === 'X' ? '10' : '12'} papers.
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5">
            {(['X', 'XII'] as const).map((c) => (
              <button key={c} onClick={() => setCls(c)} className={pill(cls === c)}>Class {c === 'X' ? '10' : '12'}</button>
            ))}
          </div>
          {tab === 'board' ? (
            <>
              <select className="select" value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="Year">
                {BOARD_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <div className="flex gap-1.5">
                {(['Main', 'Compartment'] as const).map((e) => (
                  <button key={e} onClick={() => setExam(e)} className={pill(exam === e)}>{e} exam</button>
                ))}
              </div>
            </>
          ) : (
            <select className="select" value={session} onChange={(e) => setSession(e.target.value)} aria-label="Session">
              {CBSE_SESSIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          )}
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
          {count === 0 && <p className="py-8 text-center text-sm text-slate-500">No papers match. Try another year or session, or clear the search.</p>}

          {tab === 'board' &&
            boardList.map((p) => (
              <div key={`${p.year}-${p.exam}-${p.cls}-${p.subject}`} className="flex flex-col gap-2 py-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{p.subject}</div>
                  <div className="text-xs text-slate-500">CBSE Class {p.cls} · {p.exam} exam {p.year}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <PdfLink href={p.qp}>{isZip(p.qp) ? <FileArchive className="h-4 w-4" /> : <FileText className="h-4 w-4" />} Question papers{isZip(p.qp) ? ' (ZIP)' : ''}</PdfLink>
                  {p.ms ? (
                    <PdfLink href={p.ms}><FileCheck2 className="h-4 w-4" /> Marking scheme{isZip(p.ms) ? ' (ZIP)' : ''}</PdfLink>
                  ) : (
                    <span className="self-center text-xs text-slate-400">No marking scheme published</span>
                  )}
                  {practice(myClass ? appSubjectOf(p.subject) : undefined)}
                </div>
                {p.cls === 'X' && p.exam === 'Main' && hosted('CBSE Board Paper', HOSTED_BOARD[p.subject], String(p.year)).map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center gap-1.5 sm:basis-full sm:pl-0">
                    <span className="text-xs text-slate-500">Read here{r.parts ? ` · series ${r.title.match(/series ([\d/]+)/)?.[1]}` : ''}:</span>
                    <HostedPdfButtons r={r} compact />
                  </div>
                ))}
              </div>
            ))}

          {tab === 'sqp' &&
            sqpList.map((p) => (
              <div key={`${p.cls}-${p.session}-${p.subject}`} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{p.subject}</div>
                  <div className="text-xs text-slate-500">CBSE Class {p.cls} · Sample paper {p.session}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.sqp && <PdfLink href={p.sqp}><FileText className="h-4 w-4" /> Question Paper</PdfLink>}
                  {p.ms && <PdfLink href={p.ms}><FileCheck2 className="h-4 w-4" /> Marking Scheme</PdfLink>}
                  {p.sqpHindi && <PdfLink href={p.sqpHindi}>प्रश्न पत्र</PdfLink>}
                  {p.msHindi && <PdfLink href={p.msHindi}>अंकन योजना</PdfLink>}
                  {p.cls === 'X' && hosted('CBSE Sample Paper', HOSTED_SQP[p.subject], p.session).map((r) => <HostedPdfButtons key={r.id} r={r} compact />)}
                  {practice(myClass ? appSubjectOf(p.subject) : undefined)}
                </div>
              </div>
            ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Files open on CBSE’s websites (cbse.gov.in and cbseacademic.nic.in). Board papers come as ZIP files with every set of that exam; “Read” and “Set” buttons open copies hosted on EduGenie, right here in the app. Questions from these papers, with their official answers, are in Practice and the Doubt Solver.
        </p>
      </section>
    </div>
  );
}
