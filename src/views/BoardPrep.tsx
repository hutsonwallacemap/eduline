import { AlarmClock, AlertTriangle, BarChart3, CalendarDays, ChevronRight, FileText, Info, PenLine, Sparkles, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import MathText from '../components/MathText';
import SubjectIcon from '../components/SubjectIcon';
import { AUTHORED } from '../data/bank';
import { CLASS10_PREP, EIGHT_WEEK_PLAN, NINETY_PLUS, TIME_PLAN } from '../data/boardPrep';
import { ncertChapter } from '../data/library';
import { noteFor, noteKey } from '../data/notes';
import { subjectsFor } from '../data/curriculum';
import { useApp } from '../store';

function Card({ icon: Icon, title, children, tint = 'text-violet-600' }: { icon: typeof Trophy; title: string; children: React.ReactNode; tint?: string }) {
  return (
    <section className="card p-5">
      <h2 className="mb-3 flex items-center gap-2 font-semibold">
        <Icon className={`h-5 w-5 ${tint}`} /> {title}
      </h2>
      {children}
    </section>
  );
}

export default function BoardPrep() {
  const { selectedGrade, selectedStream, setSubject, setChapter, setView, setOpenNote } = useApp();
  const isClass10 = selectedGrade === 10;
  const [subjectName, setSubjectName] = useState(CLASS10_PREP[0].subject);
  const prep = CLASS10_PREP.find((p) => p.subject === subjectName)!;
  const subject = subjectsFor(10, 'General').find((s) => s.name === subjectName);
  const maxUnit = Math.max(...prep.weightage.map((w) => w.marks));

  // EduGenie's solved questions for the chosen subject, grouped by chapter in syllabus order.
  const solved = useMemo(() => {
    const qs = AUTHORED.filter((q) => q.grade === 10 && q.subject === subjectName && q.source === 'EduGenie solved question');
    const order = subject?.chapters ?? [];
    return order.map((ch) => ({ chapter: ch, questions: qs.filter((q) => q.chapter === ch) })).filter((g) => g.questions.length);
  }, [subjectName, subject]);

  const practise = (chapter: string) => {
    setSubject(subjectName);
    setTimeout(() => setChapter(chapter), 0);
    setView('practice');
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white sm:p-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-white/80"><Trophy className="h-4 w-4" /> Board Prep</div>
        <h1 className="text-2xl font-bold sm:text-3xl">{isClass10 ? 'Your plan for 90%+ in Class 10 boards' : 'Your plan for top marks in board exams'}</h1>
        <p className="mt-2 max-w-2xl text-white/85">
          Know the paper pattern, study the chapters that carry the most marks, and write answers the way the marking scheme rewards.
        </p>
      </section>

      {isClass10 ? (
        <>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {CLASS10_PREP.map((p) => {
              const s = subjectsFor(10, 'General').find((x) => x.name === p.subject);
              return (
                <button
                  key={p.subject}
                  onClick={() => setSubjectName(p.subject)}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    p.subject === subjectName ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300' : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700'
                  }`}
                >
                  {s && <SubjectIcon name={s.icon} className="h-4 w-4" />} {p.subject}
                </button>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card icon={FileText} title="Paper pattern">
              <p className="mb-3 text-sm text-slate-500">{prep.paper} · plus 20 marks internal assessment</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                      <th className="py-2 pr-2">Section</th><th className="pr-2">Type</th><th className="pr-2 text-right">Qs</th><th className="pr-2 text-right">Marks each</th><th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prep.sections.map((s) => (
                      <tr key={s.name} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 pr-2 font-semibold">{s.name}</td>
                        <td className="pr-2">{s.type}</td>
                        <td className="pr-2 text-right">{s.questions}</td>
                        <td className="pr-2 text-right">{s.marksEach}</td>
                        <td className="text-right font-medium">{s.total}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-2 font-semibold" colSpan={4}>Total</td>
                      <td className="text-right font-bold">{prep.sections.reduce((t, s) => t + s.total, 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card icon={BarChart3} title="Where the marks are (unit weightage)" tint="text-indigo-600">
              <div className="space-y-3">
                {prep.weightage.map((w) => (
                  <div key={w.unit}>
                    <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium">{w.unit}</span>
                      <span className="shrink-0 font-semibold">{w.marks} marks</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${(w.marks / maxUnit) * 100}%` }} />
                    </div>
                    {w.chapters && <div className="mt-0.5 text-xs text-slate-500">{w.chapters}</div>}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">Study the highest-weightage units first, but cover everything — every unit appears in the paper.</p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card icon={PenLine} title="How to write answers that score full marks" tint="text-emerald-600">
                <div className="grid gap-4 sm:grid-cols-2">
                  {prep.howToWrite.map((h) => (
                    <div key={h.title} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                      <h3 className="mb-2 text-sm font-semibold">{h.title}</h3>
                      <ul className="list-disc space-y-1 pl-4 text-sm text-slate-700 dark:text-slate-300">
                        {h.points.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                  ))}
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                    <h3 className="mb-2 text-sm font-semibold">Answer length by marks</h3>
                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      <li><b>1 mark</b> — the option, a word or one line</li>
                      <li><b>2 marks</b> — 30–50 words or two steps</li>
                      <li><b>3 marks</b> — 50–80 words, three points</li>
                      <li><b>5 marks</b> — 80–120 words, five points or full working</li>
                      <li><b>4-mark case</b> — answer each sub-part separately</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
            <div className="space-y-6">
              <Card icon={AlertTriangle} title="Mistakes that cost marks" tint="text-amber-500">
                <ul className="space-y-2 text-sm">
                  {prep.mistakes.map((m) => (
                    <li key={m} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /> {m}</li>
                  ))}
                </ul>
              </Card>
              {prep.notInBoard && (
                <Card icon={Info} title="Not in the 2026-27 board exam" tint="text-sky-600">
                  <p className="mb-2 text-xs text-slate-500">Still in the syllabus and taught, but assessed only in school (internal, periodic or project work).</p>
                  <ul className="space-y-2 text-sm">
                    {prep.notInBoard.map((m) => (
                      <li key={m} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" /> {m}</li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </div>

          <Card icon={Sparkles} title={`Important questions with solutions — ${subjectName}`}>
            {solved.length === 0 ? (
              <p className="text-sm text-slate-500">Solved questions for {subjectName} are coming soon. Use Practice for board questions.</p>
            ) : (
              <div className="space-y-4">
                {solved.map((g) => (
                  <div key={g.chapter}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">{g.chapter}</h3>
                      <div className="flex gap-3 text-xs font-medium">
                        {noteFor(subjectName, g.chapter) && (
                          <button onClick={() => setOpenNote(noteKey(subjectName, g.chapter))} className="text-sky-600 hover:underline">Notes</button>
                        )}
                        {ncertChapter(10, subjectName, g.chapter) && (
                          <a href={ncertChapter(10, subjectName, g.chapter)!.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">NCERT chapter ↗</a>
                        )}
                        <button onClick={() => practise(g.chapter)} className="text-violet-600 hover:underline">Practise this chapter →</button>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
                      {g.questions.map((q) => (
                        <details key={q.id} className="group px-4 py-3">
                          <summary className="flex cursor-pointer list-none items-start gap-2 text-sm">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-90" />
                            <span className="flex-1"><MathText text={q.question} /></span>
                            <span className="chip shrink-0 bg-slate-100 dark:bg-slate-800">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                          </summary>
                          <div className="ml-6 mt-2 space-y-2 text-sm">
                            {q.options && (
                              <ol className="space-y-0.5">
                                {q.options.map((o, i) => (
                                  <li key={i} className={i === q.correctAnswer ? 'font-semibold text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}>
                                    {String.fromCharCode(65 + i)}. <MathText text={o} /> {i === q.correctAnswer && '✓'}
                                  </li>
                                ))}
                              </ol>
                            )}
                            <div className="rounded-lg bg-emerald-50 p-3 leading-relaxed dark:bg-emerald-500/10">
                              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Solution</div>
                              <div className="whitespace-pre-line"><MathText text={q.explanation} /></div>
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      ) : (
        <section className="card p-5 text-sm text-slate-600 dark:text-slate-300">
          Subject-wise paper patterns and solved important questions are available for <b>Class 10</b>. For Class {selectedGrade}
          {selectedGrade >= 11 ? ` (${selectedStream})` : ''}, use the plan below with Practice and the CBSE papers in Sample Papers.
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card icon={AlarmClock} title="Exam-day time plan (3 hours)" tint="text-rose-500">
          <ol className="space-y-2 text-sm">
            {TIME_PLAN.map((t) => (
              <li key={t.slot} className="flex gap-3">
                <span className="w-32 shrink-0 font-semibold">{t.slot}</span>
                <span className="text-slate-700 dark:text-slate-300">{t.plan}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card icon={CalendarDays} title="8-week revision plan" tint="text-sky-600">
          <ol className="space-y-3 text-sm">
            {EIGHT_WEEK_PLAN.map((w) => (
              <li key={w.weeks}>
                <div className="font-semibold">{w.weeks}</div>
                <div className="text-slate-700 dark:text-slate-300">{w.focus}</div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card icon={Trophy} title="Habits of 90%+ scorers" tint="text-amber-500">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {NINETY_PLUS.map((h) => (
            <li key={h} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> {h}</li>
          ))}
        </ul>
      </Card>

      <p className="text-xs text-slate-500">
        Paper pattern, weightage and assessment notes follow CBSE's 2026-27 Class 10 curriculum and sample question papers (CBSE states the paper design is unchanged from 2025-26).
        The new optional Advanced-level Mathematics and Science courses start in Class 9 in 2026-27 and do not change the Class 10 board exam this year.
      </p>
    </div>
  );
}
