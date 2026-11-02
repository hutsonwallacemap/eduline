import { Clock, Eye, FileCheck2, Filter, Printer, Timer, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ALL_DOC_TYPES, PAPERS, type DocType, type Paper } from '../data/papers';
import { useApp } from '../store';

function MultiFilter<T extends string | number>({ label, options, value, onChange, render = String }: {
  label: string; options: T[]; value: T[]; onChange: (v: T[]) => void; render?: (v: T) => string;
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={String(o)}
              onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
              className={`chip cursor-pointer border py-1 transition ${
                on ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              {render(o)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PaperModal({ paper, mode, onClose }: { paper: Paper; mode: 'paper' | 'scheme'; onClose: () => void }) {
  const sections = paper.board === 'CBSE'
    ? [['A', 'MCQs & Assertion-Reason', 20, 1], ['B', 'Very Short Answer', 5, 2], ['C', 'Short Answer', 6, 3], ['D', 'Long Answer', 4, 5], ['E', 'Case-Based', 3, 4]]
    : [['A', 'Compulsory short questions', 15, 2], ['B', 'Long answer (attempt any 4 of 6)', 4, 12.5]];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" onClick={onClose}>
      <div className="card max-h-[85vh] w-full max-w-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center gap-2 border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">{mode === 'paper' ? 'Paper preview' : 'Marking scheme'}</h2>
          <button onClick={() => window.print()} className="btn-ghost ml-auto !py-1.5"><Printer className="h-4 w-4" /> Print / Save PDF</button>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div id="print-area" className="p-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-slate-500">{paper.board} · {paper.docType}</div>
            <h3 className="mt-1 text-xl font-bold">{paper.subject} — Class {paper.grade} ({paper.year})</h3>
            <div className="mt-1 text-sm text-slate-500">Maximum Marks: {paper.marks} · Time: {paper.durationHours} Hours</div>
          </div>
          <table className="mt-6 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-700">
                <th className="py-2">Section</th><th>Question type</th><th className="text-right">Questions</th><th className="text-right">Marks each</th>
              </tr>
            </thead>
            <tbody>
              {sections.map(([s, t, n, m]) => (
                <tr key={s} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 font-medium">{s}</td><td>{t}</td><td className="text-right">{n}</td><td className="text-right">{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed dark:bg-slate-800/60">
            {mode === 'paper' ? (
              <>
                <p className="font-medium">General instructions</p>
                <ul className="mt-1 list-disc pl-5 text-slate-600 dark:text-slate-300">
                  <li>All questions are compulsory unless an internal choice is stated.</li>
                  <li>Draw neat, labelled diagrams wherever required.</li>
                  <li>Use of calculators is not permitted.</li>
                </ul>
              </>
            ) : paper.board === 'CBSE' ? (
              <>
                <p className="font-medium">CBSE step-marking guidance</p>
                <ul className="mt-1 list-disc pl-5 text-slate-600 dark:text-slate-300">
                  <li><strong>Formula / principle</strong> stated correctly: ½–1 mark.</li>
                  <li><strong>Substitution</strong> with units: ½–1 mark.</li>
                  <li><strong>Final answer</strong> with correct unit: 1 mark. Alternative valid methods get full credit.</li>
                </ul>
              </>
            ) : (
              <>
                <p className="font-medium">ICSE keyword-marking guidance</p>
                <ul className="mt-1 list-disc pl-5 text-slate-600 dark:text-slate-300">
                  <li>Definitions earn marks only with the <strong>precise keywords</strong> (e.g. “constant temperature” in Ohm’s law).</li>
                  <li>Units and significant figures are checked strictly.</li>
                  <li>Diagrams need every label shown in the scheme.</li>
                </ul>
              </>
            )}
          </div>
          <p className="mt-4 text-xs text-slate-400">Demo preview. Link this to the board’s official PDF in production.</p>
        </div>
      </div>
    </div>
  );
}

export default function Papers() {
  const { selectedBoard, selectedGrade, setView } = useApp();
  const [boards, setBoards] = useState<('CBSE' | 'ICSE')[]>(selectedBoard === 'ICSE' ? ['ICSE'] : ['CBSE']);
  const [grades, setGrades] = useState<number[]>([selectedGrade]);
  const [years, setYears] = useState<number[]>([]);
  const [types, setTypes] = useState<DocType[]>([]);
  const [open, setOpen] = useState<{ paper: Paper; mode: 'paper' | 'scheme' } | null>(null);

  const list = useMemo(
    () =>
      PAPERS.filter(
        (p) =>
          (!boards.length || boards.includes(p.board)) &&
          (!grades.length || grades.includes(p.grade)) &&
          (!years.length || years.includes(p.year)) &&
          (!types.length || types.includes(p.docType)),
      ),
    [boards, grades, years, types],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="card h-fit space-y-4 p-4">
        <div className="flex items-center gap-2 font-semibold"><Filter className="h-4 w-4 text-violet-600" /> Filters</div>
        <MultiFilter label="Board" options={['CBSE', 'ICSE'] as ('CBSE' | 'ICSE')[]} value={boards} onChange={setBoards} />
        <MultiFilter label="Class" options={[7, 8, 9, 10, 11, 12]} value={grades} onChange={setGrades} />
        <MultiFilter label="Year" options={[2025, 2024, 2023, 2022, 2021, 2020]} value={years} onChange={setYears} />
        <MultiFilter label="Document type" options={ALL_DOC_TYPES} value={types} onChange={setTypes} />
        <button onClick={() => { setBoards([]); setGrades([]); setYears([]); setTypes([]); }} className="text-sm text-violet-600 hover:underline">Clear all</button>
      </aside>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h1 className="text-lg font-semibold">Sample Papers Vault</h1>
          <span className="text-sm text-slate-500">{list.length} papers</span>
        </div>
        <div className="space-y-3">
          {list.length === 0 && <div className="card p-8 text-center text-slate-500">No papers match these filters.</div>}
          {list.map((p) => (
            <div key={p.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="font-medium">{p.board} Class {p.grade} {p.subject} — {p.year}</div>
                <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                  <span className="chip bg-slate-100 dark:bg-slate-800">{p.docType}</span>
                  <span className="chip bg-slate-100 dark:bg-slate-800">{p.marks} Marks</span>
                  <span className="chip bg-slate-100 dark:bg-slate-800"><Clock className="h-3 w-3" /> {p.durationHours} Hours</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setOpen({ paper: p, mode: 'paper' })} className="btn-ghost !px-3 !py-1.5"><Eye className="h-4 w-4" /> View Paper</button>
                <button onClick={() => setOpen({ paper: p, mode: 'scheme' })} className="btn-ghost !px-3 !py-1.5"><FileCheck2 className="h-4 w-4" /> Marking Scheme (PDF)</button>
                <button onClick={() => setView('practice', { subject: p.subject, timeLimitMinutes: 30 })} className="btn-primary !px-3 !py-1.5"><Timer className="h-4 w-4" /> Solve as Timed Test</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {open && <PaperModal paper={open.paper} mode={open.mode} onClose={() => setOpen(null)} />}
    </div>
  );
}
