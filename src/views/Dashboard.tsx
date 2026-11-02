import { ArrowRight, Award, BookMarked, FileText, MessageCircleQuestion, PenLine, Target } from 'lucide-react';
import SubjectIcon from '../components/SubjectIcon';
import { subjectsFor } from '../data/curriculum';
import { tierOf, useApp, type View } from '../store';

const MODULES: { view: View; title: string; desc: string; icon: typeof Target; tint: string }[] = [
  { view: 'doubts', title: 'AI Doubt Solver', desc: 'Step-by-step answers with formulas', icon: MessageCircleQuestion, tint: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300' },
  { view: 'practice', title: 'Practice Generator', desc: 'Timed tests with instant grading', icon: PenLine, tint: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' },
  { view: 'revision', title: 'Formula Sheets', desc: 'Flashcards and cheat sheets', icon: BookMarked, tint: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
  { view: 'papers', title: 'Sample Papers', desc: 'Board papers and marking schemes', icon: FileText, tint: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
];

const HERO = {
  junior: { title: 'Ready for today’s quest?', sub: 'Finish 3 practice rounds to unlock the “Curious Mind” badge.' },
  secondary: { title: 'Board exams are a marathon, not a sprint', sub: 'Steady daily practice beats last-minute cramming.' },
  senior: { title: 'Build depth for boards and beyond', sub: 'Every chapter is tagged with JEE / NEET / CUET relevance.' },
};

export default function Dashboard() {
  const { selectedBoard, selectedGrade, selectedStream, dailyDone, dailyTarget, streak, setView } = useApp();
  const tier = tierOf(selectedGrade);
  const subjects = subjectsFor(selectedGrade, selectedStream);
  const pct = Math.min(100, Math.round((dailyDone / dailyTarget) * 100));

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
            <button onClick={() => setView('doubts')} className="btn bg-white text-violet-700 hover:bg-violet-50">
              Ask a doubt <ArrowRight className="h-4 w-4" />
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
                onClick={() => setView('practice', { subject: sub.name })}
                className="card group cursor-pointer p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${sub.color} text-white`}>
                  <SubjectIcon name={sub.icon} className="h-5 w-5" />
                </span>
                <div className="font-medium">{sub.name}</div>
                <div className="text-xs text-slate-500">{sub.chapters.length} chapters</div>
                {sub.examTag && (
                  <span className="chip mt-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">{sub.examTag}</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-violet-600" />
            <h2 className="font-semibold">Daily practice target</h2>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{dailyDone}<span className="text-base text-slate-400">/{dailyTarget}</span></span>
            <span className="text-sm text-slate-500">questions</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {pct >= 100 ? 'Target met — great work!' : `${dailyTarget - dailyDone} more to keep your ${streak}-day streak.`}
          </p>
          {tier === 'junior' && (
            <div className="mt-4 flex gap-2">
              {['Early Bird', 'Quiz Whiz', '7-Day Star'].map((b, i) => (
                <span key={b} className={`chip ${i < 2 ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                  <Award className="h-3 w-3" /> {b}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => (
            <button key={m.view} onClick={() => setView(m.view)} className="card flex cursor-pointer items-start gap-3 p-4 text-left transition hover:shadow-md">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${m.tint}`}>
                <m.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-medium">{m.title}</span>
                <span className="block text-sm text-slate-500">{m.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
