import { AlertTriangle, Bookmark, CheckCircle2, ChevronLeft, ChevronRight, Clock, ExternalLink, Lightbulb, Loader2, RotateCcw, Settings2, Target, ThumbsDown, ThumbsUp, Timer, XCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import MathText from '../components/MathText';
import SubjectChapterPicker, { useSelectedSubject } from '../components/SubjectChapterPicker';
import { subjectsFor } from '../data/curriculum';
import { ALL_CHAPTERS, isOfficial, pickQuestions } from '../data/bank';
import { isCorrect } from '../data/questions';
import { useApp } from '../store';
import type { AnswerRecord, Difficulty, Question, QuestionType, QuizConfig } from '../types/quiz';

type Phase = 'config' | 'live' | 'report';

const TYPE_LABEL: Record<QuestionType, string> = { mcq: 'MCQs', assertion_reason: 'Assertion-Reason', short_answer: 'Short Answer', descriptive: 'Board written answers' };
const DIFFICULTY_LABEL: Record<Difficulty, string> = { Easy: 'Foundational', Moderate: 'Moderate', 'Board Exam Level': 'Board Standard' };

const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.max(0, sec) % 60).padStart(2, '0')}`;

/* ---------------- Configurator ---------------- */

function Configurator({ onStart, busy, error }: { onStart: (cfg: QuizConfig) => void; busy: boolean; error: string | null }) {
  const { selectedBoard, selectedGrade, selectedStream, selectedChapter, practicePreset, setSubject } = useApp();
  const subject = useSelectedSubject();
  const [count, setCount] = useState<5 | 10 | 20>(5);
  const [types, setTypes] = useState<QuestionType[]>(['mcq', 'assertion_reason', 'short_answer', 'descriptive']);
  const [difficulty, setDifficulty] = useState<Difficulty>('Moderate');

  // A sample paper's "Solve as Timed Test" pre-selects its subject when it exists for this class.
  useEffect(() => {
    const name = practicePreset?.subject;
    if (name && subjectsFor(selectedGrade, selectedStream).some((s) => s.name === name)) setSubject(name);
  }, [practicePreset?.subject, selectedGrade, selectedStream, setSubject]);

  const toggleType = (t: QuestionType) =>
    setTypes((ts) => (ts.includes(t) ? (ts.length > 1 ? ts.filter((x) => x !== t) : ts) : [...ts, t]));

  const pill = (active: boolean) =>
    `cursor-pointer rounded-xl border px-3 py-2 text-sm transition ${
      active ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' : 'border-slate-200 hover:border-violet-300 dark:border-slate-700'
    }`;
  const ready = !!subject && !!selectedChapter;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card p-6">
        <div className="mb-5 flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-violet-600" />
          <h1 className="text-xl font-semibold">Configure your practice test</h1>
        </div>
        {practicePreset?.timeLimitMinutes && (
          <div className="mb-4 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-300">
            Timed sample-paper mode: {practicePreset.timeLimitMinutes} minutes.
          </div>
        )}
        <div className="space-y-5">
          <SubjectChapterPicker />
          <div>
            <span className="mb-1 block text-sm font-medium">Number of questions</span>
            <div className="flex gap-2">
              {([5, 10, 20] as const).map((n) => (
                <button key={n} onClick={() => setCount(n)} className={pill(count === n)}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium">Question types</span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TYPE_LABEL) as QuestionType[]).map((t) => (
                <button key={t} onClick={() => toggleType(t)} className={pill(types.includes(t))}>{TYPE_LABEL[t]}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium">Difficulty</span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DIFFICULTY_LABEL) as Difficulty[]).map((d) => (
                <button key={d} onClick={() => setDifficulty(d)} className={pill(difficulty === d)}>{DIFFICULTY_LABEL[d]}</button>
              ))}
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        <button
          className="btn-primary mt-6 w-full !py-3"
          disabled={!ready || busy}
          onClick={() =>
            subject &&
            onStart({
              board: selectedBoard,
              grade: selectedGrade,
              subject: subject.name,
              chapter: selectedChapter,
              difficulty,
              questionCount: count,
              types,
              timeLimitMinutes: practicePreset?.timeLimitMinutes ?? Math.ceil(count * 1.5),
            })
          }
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Preparing {subject?.name} questions…
            </>
          ) : ready ? (
            `Start ${subject.name} test`
          ) : (
            'Choose a subject and chapter'
          )}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Live quiz ---------------- */

function LiveQuiz({ cfg, questions, onSubmit }: {
  cfg: QuizConfig; questions: Question[]; onSubmit: (answers: AnswerRecord[], timeUsedSec: number) => void;
}) {
  const total = cfg.timeLimitMinutes * 60;
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(total);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>(() =>
    questions.map((_, i) => ({ answer: null, visited: i === 0, markedForReview: false, timeSpentSec: 0 })),
  );
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const submitted = useRef(false);

  // One clock drives both the countdown and per-question time.
  useEffect(() => {
    const t = setInterval(() => {
      setLeft((l) => l - 1);
      setAnswers((as) => as.map((a, i) => (i === idxRef.current ? { ...a, timeSpentSec: a.timeSpentSec + 1 } : a)));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const submit = () => {
    if (submitted.current) return;
    submitted.current = true;
    onSubmit(answers, total - Math.max(0, left));
  };

  useEffect(() => {
    if (left <= 0) submit();
  }, [left]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (i: number) => {
    setIdx(i);
    setShowHint(false);
    setAnswers((as) => as.map((a, j) => (j === i ? { ...a, visited: true } : a)));
  };
  const update = (patch: Partial<AnswerRecord>) => setAnswers((as) => as.map((a, i) => (i === idx ? { ...a, ...patch } : a)));

  const q = questions[idx];
  const a = answers[idx];
  const ratio = left / total;
  const timerTone = ratio > 0.5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
    : ratio > 0.2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
    : 'bg-red-100 text-red-700 animate-pulse dark:bg-red-500/15 dark:text-red-300';

  const paletteTone = (r: AnswerRecord, i: number) => {
    const answered = r.answer !== null && r.answer !== '';
    const base = i === idx ? 'ring-2 ring-violet-500 ring-offset-1 dark:ring-offset-slate-900 ' : '';
    if (r.markedForReview) return base + (answered ? 'bg-violet-600 text-white' : 'bg-violet-200 text-violet-800 dark:bg-violet-500/30 dark:text-violet-200');
    if (answered) return base + 'bg-emerald-500 text-white';
    if (r.visited) return base + 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
    return base + 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div className="card flex flex-wrap items-center gap-3 p-3">
          <div className="text-sm">
            <span className="font-semibold">{cfg.subject}</span>
            <span className="text-slate-500"> · {cfg.chapter} · {DIFFICULTY_LABEL[cfg.difficulty]}</span>
          </div>
          <span className={`chip ml-auto !px-3 !py-1 text-sm ${timerTone}`}>
            <Timer className="h-4 w-4" /> {fmt(Math.max(0, left))}
          </span>
          <button onClick={submit} className="btn-primary !py-1.5">Submit test</button>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-900 dark:text-slate-100">Question {idx + 1} of {questions.length}</span>
            <span className="chip bg-slate-100 dark:bg-slate-800">{TYPE_LABEL[q.type]}</span>
            <span className="chip bg-slate-100 dark:bg-slate-800">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
          </div>
          <div className="mb-5 whitespace-pre-line text-base leading-relaxed"><MathText text={q.question} /></div>

          {q.options ? (
            <div className="space-y-2" role="radiogroup">
              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                    a.answer === i ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10' : 'border-slate-200 hover:border-violet-300 dark:border-slate-700'
                  }`}
                >
                  <input type="radio" name={q.id} checked={a.answer === i} onChange={() => update({ answer: i })} className="mt-1 accent-violet-600" />
                  <span className="mr-1 font-medium text-slate-500">{String.fromCharCode(65 + i)}.</span>
                  <MathText text={opt} />
                </label>
              ))}
            </div>
          ) : q.type === 'descriptive' ? (
            <textarea
              value={(a.answer as string) ?? ''}
              onChange={(e) => update({ answer: e.target.value })}
              rows={6}
              placeholder="Write your answer. After you submit, compare it with CBSE's official marking scheme and mark yourself."
              className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-violet-500 dark:border-slate-700"
            />
          ) : (
            <input
              value={(a.answer as string) ?? ''}
              onChange={(e) => update({ answer: e.target.value })}
              placeholder="Type your answer"
              className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 outline-none focus:border-violet-500 dark:border-slate-700"
            />
          )}
          {q.source && <p className="mt-3 text-xs text-slate-500">Source: {q.source}</p>}

          {q.hint && (
            <div className="mt-4">
              {showHint ? (
                <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                  <MathText text={q.hint} />
                </div>
              ) : (
                <button onClick={() => setShowHint(true)} className="inline-flex cursor-pointer items-center gap-1 text-sm text-amber-600 hover:underline">
                  <Lightbulb className="h-4 w-4" /> Show hint
                </button>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button onClick={() => go(idx - 1)} disabled={idx === 0} className="btn-ghost"><ChevronLeft className="h-4 w-4" /> Previous</button>
            <button onClick={() => update({ markedForReview: !a.markedForReview })} className="btn-ghost">
              <Bookmark className={`h-4 w-4 ${a.markedForReview ? 'fill-violet-600 text-violet-600' : ''}`} />
              {a.markedForReview ? 'Unmark' : 'Mark for review'}
            </button>
            <button onClick={() => update({ answer: null })} className="btn-ghost">Clear</button>
            {idx < questions.length - 1 ? (
              <button onClick={() => go(idx + 1)} className="btn-primary ml-auto">Save & next <ChevronRight className="h-4 w-4" /></button>
            ) : (
              <button onClick={submit} className="btn-primary ml-auto">Finish & submit</button>
            )}
          </div>
        </div>
      </div>

      <aside className="card h-fit p-4">
        <h3 className="mb-3 text-sm font-semibold">Question palette</h3>
        <div className="grid grid-cols-5 gap-2">
          {answers.map((r, i) => (
            <button key={i} onClick={() => go(i)} className={`h-9 cursor-pointer rounded-lg text-sm font-medium ${paletteTone(r, i)}`}>{i + 1}</button>
          ))}
        </div>
        <div className="mt-4 space-y-1.5 text-xs text-slate-500">
          {[
            ['bg-emerald-500', 'Answered'],
            ['bg-red-200 dark:bg-red-500/30', 'Visited, not answered'],
            ['bg-violet-200 dark:bg-violet-500/30', 'Marked for review'],
            ['bg-violet-600', 'Answered & marked'],
            ['bg-slate-200 dark:bg-slate-700', 'Not visited'],
          ].map(([c, l]) => (
            <div key={l} className="flex items-center gap-2"><span className={`h-3 w-3 rounded ${c}`} /> {l}</div>
          ))}
        </div>
      </aside>
    </div>
  );
}

/* ---------------- Report ---------------- */

function Report({ cfg, questions, answers, timeUsedSec, onRetryMissed, onNew }: {
  cfg: QuizConfig; questions: Question[]; answers: AnswerRecord[]; timeUsedSec: number; onRetryMissed: (missed: Question[]) => void; onNew: () => void;
}) {
  // Written answers are marked by the student against the official marking scheme.
  const [selfMarks, setSelfMarks] = useState<Record<number, boolean>>({});
  const got = (q: Question, i: number) => (q.type === 'descriptive' ? selfMarks[i] === true : isCorrect(q, answers[i].answer));
  const pending = questions.filter((q, i) => q.type === 'descriptive' && selfMarks[i] === undefined).length;

  const stats = useMemo(() => {
    let score = 0, max = 0, correct = 0, attempted = 0;
    questions.forEach((q, i) => {
      max += q.marks;
      const a = answers[i].answer;
      if ((a !== null && a !== '') || (q.type === 'descriptive' && selfMarks[i] !== undefined)) attempted++;
      if (q.type === 'descriptive' ? selfMarks[i] === true : isCorrect(q, a)) { correct++; score += q.marks; }
    });
    return { score, max, correct, attempted, pct: Math.round((score / max) * 100), accuracy: attempted ? Math.round((correct / attempted) * 100) : 0 };
  }, [questions, answers, selfMarks]);

  const display = (q: Question, a: number | string | null) => {
    if (a === null || a === '') return '—';
    return q.options && typeof a === 'number' ? `${String.fromCharCode(65 + a)}. ${q.options[a]}` : String(a);
  };
  const correctDisplay = (q: Question) =>
    q.options ? `${String.fromCharCode(65 + Number(q.correctAnswer))}. ${q.options[Number(q.correctAnswer)]}` : q.type === 'descriptive' ? 'See marking scheme below' : String(q.correctAnswer).split('|')[0];

  const missedQuestions = questions.filter((q, i) => !got(q, i));
  const missed = missedQuestions.length;
  const tiles = [
    { label: 'Score', value: `${stats.pct}%`, sub: `${stats.score}/${stats.max} marks`, icon: Target },
    { label: 'Accuracy', value: `${stats.accuracy}%`, sub: `${stats.correct}/${stats.attempted} attempted correct`, icon: CheckCircle2 },
    { label: 'Time used', value: fmt(timeUsedSec), sub: `of ${cfg.timeLimitMinutes}:00`, icon: Clock },
    { label: 'Avg per question', value: `${Math.round(timeUsedSec / questions.length)}s`, sub: `${questions.length} questions`, icon: Timer },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white">
        <div className="text-sm text-white/70">{cfg.board} · Class {cfg.grade} · {cfg.subject} · {cfg.chapter}</div>
        <h1 className="mt-1 text-2xl font-bold">
          {stats.pct >= 80 ? 'Excellent work!' : stats.pct >= 50 ? 'Good effort — keep going' : 'Let’s revise and retry'}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => onRetryMissed(missedQuestions)} disabled={!missed} className="btn bg-white text-violet-700 hover:bg-violet-50">
            <RotateCcw className="h-4 w-4" /> Retry missed questions ({missed})
          </button>
          <button onClick={onNew} className="btn bg-white/15 hover:bg-white/25">New test</button>
        </div>
        {pending > 0 && (
          <p className="mt-3 text-sm text-white/80">Mark your {pending} written answer{pending > 1 ? 's' : ''} below against the official marking scheme to complete your score.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="card p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><t.icon className="h-3.5 w-3.5" /> {t.label}</div>
            <div className="mt-1 text-2xl font-bold">{t.value}</div>
            <div className="text-xs text-slate-500">{t.sub}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <h2 className="border-b border-slate-200 px-4 py-3 font-semibold dark:border-slate-800">Question breakdown</h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {questions.map((q, i) => {
            const ok = got(q, i);
            const written = q.type === 'descriptive';
            return (
              <details key={q.id} className="group px-4 py-3" open={written && selfMarks[i] === undefined}>
                <summary className="flex cursor-pointer list-none items-start gap-3">
                  {written && selfMarks[i] === undefined ? (
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-dashed border-amber-400" title="Mark yourself" />
                  ) : ok ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="whitespace-pre-line text-sm"><span className="font-medium">Q{i + 1}.</span> <MathText text={q.question} /></div>
                    <div className="mt-2 grid gap-1 text-xs sm:grid-cols-3">
                      <div><span className="text-slate-500">Your answer: </span><MathText text={display(q, answers[i].answer)} className={ok ? 'text-emerald-600' : 'text-red-600'} /></div>
                      <div><span className="text-slate-500">Correct: </span><MathText text={correctDisplay(q)} className="text-emerald-600" /></div>
                      <div className="text-slate-500">Time: {answers[i].timeSpentSec}s · {q.marks} mark{q.marks > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-90" />
                </summary>
                <div className="ml-8 mt-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-600">
                    {isOfficial(q) ? 'Official answer (CBSE marking scheme)' : 'Step-by-step solution'}
                  </div>
                  {q.explanation ? <div className="whitespace-pre-line"><MathText text={q.explanation} /></div> : <p className="text-slate-500">The marking scheme gives only the answer option for this question.</p>}
                  {written && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-500">Did your answer cover these points?</span>
                      <button onClick={() => setSelfMarks((m) => ({ ...m, [i]: true }))} className={`btn !px-3 !py-1 ${selfMarks[i] === true ? 'bg-emerald-600 text-white' : 'btn-ghost'}`}>
                        <ThumbsUp className="h-4 w-4" /> Yes
                      </button>
                      <button onClick={() => setSelfMarks((m) => ({ ...m, [i]: false }))} className={`btn !px-3 !py-1 ${selfMarks[i] === false ? 'bg-red-600 text-white' : 'btn-ghost'}`}>
                        <ThumbsDown className="h-4 w-4" /> Not yet
                      </button>
                    </div>
                  )}
                  {q.sourceUrl && (
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      <a href={q.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-600 hover:underline">Question paper <ExternalLink className="h-3 w-3" /></a>
                      {q.schemeUrl && <a href={q.schemeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-600 hover:underline">Marking scheme <ExternalLink className="h-3 w-3" /></a>}
                    </div>
                  )}
                  {q.markKeywords && (
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className="text-xs text-slate-500">Mark keywords:</span>
                      {q.markKeywords.map((k) => <span key={k} className="chip bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"><MathText text={k} /></span>)}
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Container ---------------- */

export default function Practice() {
  const { logPractice, practicePreset } = useApp();
  const [phase, setPhase] = useState<Phase>('config');
  const [cfg, setCfg] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeUsed, setTimeUsed] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const start = (c: QuizConfig, qs: Question[]) => {
    setCfg(c);
    setQuestions(qs);
    setRunKey((k) => k + 1);
    setPhase('live');
  };

  /** Questions come from the offline CBSE bank: same class, subject and chapter only. */
  const begin = async (c: QuizConfig) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    const qs = await pickQuestions(c);
    setBusy(false);
    if (!qs.length) {
      setError(
        c.grade === 10 || c.grade === 12
          ? `No board questions for Class ${c.grade} ${c.subject} · ${c.chapter} yet. Pick a chapter marked with a question count, or choose “${ALL_CHAPTERS}”.`
          : `Board questions are available for Class 10 and Class 12 (from CBSE board and sample papers). Switch class in the header to practise them.`,
      );
      return;
    }
    if (qs.length < c.questionCount) setNotice(`${qs.length} question${qs.length > 1 ? 's' : ''} available for ${c.subject} · ${c.chapter}.`);
    start(practicePreset?.timeLimitMinutes ? c : { ...c, timeLimitMinutes: Math.max(2, Math.ceil(qs.reduce((t, q) => t + (q.type === 'descriptive' ? 3 * q.marks : 1.5), 0))) }, qs);
  };

  if (phase === 'config' || !cfg) return <Configurator onStart={begin} busy={busy} error={error} />;

  return (
    <div className="space-y-4">
      {notice && phase === 'live' && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {notice}
        </div>
      )}
      {phase === 'live' && (
        <LiveQuiz
          key={runKey}
          cfg={cfg}
          questions={questions}
          onSubmit={(a, t) => {
            setAnswers(a);
            setTimeUsed(t);
            logPractice(a.filter((r) => r.answer !== null && r.answer !== '').length);
            setPhase('report');
          }}
        />
      )}
      {phase === 'report' && (
        <Report
          cfg={cfg}
          questions={questions}
          answers={answers}
          timeUsedSec={timeUsed}
          onNew={() => setPhase('config')}
          onRetryMissed={(missed) => start({ ...cfg, timeLimitMinutes: Math.max(2, Math.ceil(missed.length * 1.5)) }, missed)}
        />
      )}
    </div>
  );
}
