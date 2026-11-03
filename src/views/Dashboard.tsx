import { ArrowRight, CheckCircle2, ClipboardList, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import SubjectIcon from '../components/SubjectIcon';
import { chapterCounts } from '../data/bank';
import { subjectsFor } from '../data/curriculum';
import { progressToday, tierOf, useApp } from '../store';

const HERO = {
  junior: { title: 'Build strong basics, one chapter at a time', sub: 'Short daily practice with instant feedback makes every chapter stick.' },
  secondary: { title: 'Prepare for boards the way examiners mark', sub: 'Real CBSE questions, official marking-scheme answers, and the exam pattern for every subject.' },
  senior: { title: 'Build depth for boards and beyond', sub: 'Board questions with official answers, tagged with JEE / NEET / CUET relevance.' },
};

const STEPS = [
  'Learn the paper pattern and chapter weightage',
  'Practise chapter-wise questions daily',
  'Write answers in the marking-scheme format',
  'Solve full board papers under time',
];

export default function Dashboard() {
  const state = useApp();
  const { selectedBoard, selectedGrade, selectedStream, dailyTarget, setView, setSubject } = state;
  const { done, streak } = progressToday(state);
  const tier = tierOf(selectedGrade);
  const subjects = subjectsFor(selectedGrade, selectedStream);
  const pct = Math.min(100, Math.round((done / dailyTarget) * 100));
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Number of practice questions available per subject.
  useEffect(() => {
    let live = true;
    Promise.all(subjects.map((s) => chapterCounts(selectedGrade, s.name).then((c) => [s.name, c.total] as const))).then(
      (pairs) => live && setCounts(Object.fromEntries(pairs)),
    );
    return () => {
      live = false;
    };
  }, [selectedGrade, selectedStream]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 p-6 text-white sm:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="chip bg-white/20">{selectedBoard}</span>
            <span className="chip bg-white/20">Class {selectedGrade}</span>
            {selectedGrade >= 11 && <span className="chip bg-white/20">{selectedStream}</span>}
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">{HERO[tier].title}</h1>
          <p className="mt-2 max-w-xl text-white/80">{HERO[tier].sub}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setView('prep')} className="btn bg-white text-violet-700 hover:bg-violet-50">
              Open Board Prep <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => setView('practice')} className="btn bg-white/15 hover:bg-white/25">
              Start a practice test
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">Your subjects</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {subjects.map((sub) => (
              <button
                key={sub.name}
                onClick={() => {
                  setSubject(sub.name);
                  setView('practice');
                }}
                className="card group cursor-pointer p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${sub.color} text-white`}>
                  <SubjectIcon name={sub.icon} className="h-5 w-5" />
                </span>
                <div className="font-medium">{sub.name}</div>
                <div className="text-xs text-slate-500">
                  {sub.chapters.length} chapters{counts[sub.name] ? ` · ${counts[sub.name]} practice questions` : ''}
                </div>
                {sub.examTag && (
                  <span className="chip mt-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">{sub.examTag}</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-violet-600" />
              <h2 className="font-semibold">Today’s practice</h2>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{done}<span className="text-base text-slate-400">/{dailyTarget}</span></span>
              <span className="text-sm text-slate-500">questions</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {pct >= 100
                ? 'Target met — great work!'
                : done === 0
                  ? `Answer ${dailyTarget} questions today to build your streak.`
                  : `${dailyTarget - done} more to reach today’s target${streak > 1 ? ` · ${streak}-day streak` : ''}.`}
            </p>
          </section>

          <section className="card p-5">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-emerald-600" />
              <h2 className="font-semibold">The 90%+ method</h2>
            </div>
            <ol className="space-y-2 text-sm">
              {STEPS.map((s) => (
                <li key={s} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {s}
                </li>
              ))}
            </ol>
            <button onClick={() => setView('prep')} className="mt-4 text-sm font-medium text-violet-600 hover:underline">
              See the full plan in Board Prep →
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
