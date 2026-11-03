import { AlertTriangle, BookOpenCheck, ChevronDown, ExternalLink, Lightbulb, ListOrdered, Send, Sigma, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MathText from '../components/MathText';
import SubjectChapterPicker, { useSelectedSubject } from '../components/SubjectChapterPicker';
import type { SubjectKind } from '../data/curriculum';
import { chapterQuestions, isOfficial, searchBank } from '../data/bank';
import { curatedAnswer, type AiAnswer, type ChatMessage, type Conversation } from '../data/doubts';
import type { Question } from '../types/quiz';
import { useApp } from '../store';

function Block({ title, icon: Icon, tint, children, defaultOpen = true }: {
  title: string; icon: typeof Sigma; tint: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <button onClick={() => setOpen(!open)} className="flex w-full cursor-pointer items-center gap-2 bg-slate-50 px-3 py-2 text-left text-sm font-medium dark:bg-slate-800/60">
        <Icon className={`h-4 w-4 ${tint}`} />
        {title}
        <ChevronDown className={`ml-auto h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-3 py-3 text-sm leading-relaxed">{children}</div>}
    </div>
  );
}

function AnswerCard({ a, board, kind }: { a: AiAnswer; board: string; kind?: SubjectKind }) {
  const language = kind === 'english' || kind === 'hindi';
  // Pull fenced ``` blocks out as monospace diagrams; the rest goes through KaTeX.
  const parts = a.steps.split(/```/);
  return (
    <div className="space-y-2">
      {a.examTag && <span className="chip bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">{a.examTag}</span>}
      <Block title="Direct step-by-step answer" icon={ListOrdered} tint="text-violet-600">
        {parts.map((p, i) =>
          i % 2 ? (
            <pre key={i} className="my-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-300">{p.trim()}</pre>
          ) : (
            <MathText key={i} text={p} />
          ),
        )}
      </Block>
      <Block title={language ? 'Core rule / literary device used' : kind === 'social' ? 'Key concept / definition' : 'Core formula / rule used'} icon={Sigma} tint="text-indigo-600">
        <MathText text={a.formula} />
      </Block>
      <Block title="Common board exam pitfall / tip" icon={Lightbulb} tint="text-amber-500" defaultOpen={false}>
        <MathText text={a.pitfall} />
        <div className="mt-3 rounded-lg bg-violet-50 p-2 dark:bg-violet-500/10">
          <div className="mb-1 text-xs font-semibold text-violet-700 dark:text-violet-300">
            Mark distribution keywords {board === 'ICSE' ? '(ICSE marks precise keywords)' : '(CBSE awards step marks)'}
          </div>
          <div className="flex flex-wrap gap-1">
            {a.markKeywords.map((k) => (
              <span key={k} className="chip bg-white text-violet-700 dark:bg-slate-900 dark:text-violet-300">{k}</span>
            ))}
          </div>
        </div>
      </Block>
    </div>
  );
}

/** A CBSE board / sample-paper question with its official marking-scheme answer. */
function BankAnswer({ q }: { q: Question }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60">
        <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="chip bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{q.source ?? 'EduGenie'}</span>
          <span>{q.chapter}</span>
          <span>· {q.marks} mark{q.marks > 1 ? 's' : ''}</span>
        </div>
        <div className="whitespace-pre-line font-medium"><MathText text={q.question} /></div>
        {q.options && (
          <ol className="mt-1 space-y-0.5 text-slate-600 dark:text-slate-300">
            {q.options.map((o, i) => (
              <li key={i} className={i === q.correctAnswer ? 'font-semibold text-emerald-700 dark:text-emerald-300' : ''}>
                {String.fromCharCode(65 + i)}. <MathText text={o} /> {i === q.correctAnswer && '✓'}
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="px-3 py-3 text-sm leading-relaxed">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-violet-600">
          <ListOrdered className="h-3.5 w-3.5" /> {isOfficial(q) ? 'Official answer · CBSE marking scheme' : 'Model answer · EduGenie'}
        </div>
        {q.explanation ? (
          <div className="whitespace-pre-line"><MathText text={q.explanation} /></div>
        ) : (
          <p className="text-slate-500">The marking scheme gives only the answer option for this question.</p>
        )}
        {q.sourceUrl && (
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <a href={q.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-600 hover:underline">Question paper <ExternalLink className="h-3 w-3" /></a>
            {q.schemeUrl && <a href={q.schemeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-600 hover:underline">Marking scheme <ExternalLink className="h-3 w-3" /></a>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DoubtSolver() {
  const { selectedBoard, selectedGrade, selectedChapter } = useApp();
  const subject = useSelectedSubject();
  const ready = !!subject && !!selectedChapter;
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState('new');
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [starters, setStarters] = useState<Question[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const active = convos.find((c) => c.id === activeId)!;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [active?.messages.length, thinking]);

  // Real board questions from the chosen chapter, offered as one-tap starting points.
  useEffect(() => {
    let live = true;
    if (subject && selectedChapter) chapterQuestions(selectedGrade, subject.name, selectedChapter).then((qs) => live && setStarters(qs));
    else setStarters([]);
    return () => {
      live = false;
    };
  }, [selectedGrade, subject, selectedChapter]);

  /** Answers come from the offline CBSE bank: the closest board questions in this class, subject and chapter. */
  const ask = async (text: string, picked?: Question) => {
    if (!text.trim() || thinking || !subject || !selectedChapter) return;
    const chapter = selectedChapter;
    const uid = crypto.randomUUID();
    const userMsg: ChatMessage = { id: uid, role: 'user', text: text.trim() };
    const isNew = activeId === 'new';
    const targetId = isNew ? uid : activeId;
    const append = (m: ChatMessage) =>
      setConvos((cs) => cs.map((c) => (c.id === targetId ? { ...c, messages: [...c.messages, m] } : c)));

    setConvos((cs) =>
      // A question from the "New doubt" state starts a new conversation.
      isNew
        ? [{ id: uid, title: text.trim(), meta: `Class ${selectedGrade} · ${subject.name} · ${chapter}`, messages: [userMsg] }, ...cs]
        : cs.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, userMsg] } : c)),
    );
    setActiveId(targetId);
    setInput('');
    setThinking(true);

    const matches = picked ? [picked] : await searchBank(selectedGrade, subject.name, chapter, text);
    if (matches.length) {
      append({ id: crypto.randomUUID(), role: 'ai', matches });
    } else {
      const curated = curatedAnswer(text, subject.kind);
      append(
        curated
          ? { id: crypto.randomUUID(), role: 'ai', answer: curated, kind: subject.kind }
          : {
              id: crypto.randomUUID(),
              role: 'ai',
              notice: `No board question close to that in ${subject.name} · ${chapter}. Try the key words from your textbook question, or pick one of these:`,
              matches: await chapterQuestions(selectedGrade, subject.name, chapter, 3),
              asSuggestions: true,
            },
      );
    }
    setThinking(false);
  };

  const messages = activeId === 'new' ? [] : active?.messages ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4">
        <button onClick={() => setActiveId('new')} className="btn-primary w-full">
          <Sparkles className="h-4 w-4" /> New doubt
        </button>
        <div className="card p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Ask about</h3>
          <SubjectChapterPicker compact />
        </div>
        {convos.length > 0 && (
        <div className="card p-3">
          <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Your questions</h3>
          <div className="space-y-1">
            {convos.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm transition ${
                  c.id === activeId ? 'bg-violet-50 dark:bg-violet-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <MathText text={c.title} className="line-clamp-1 font-medium" />
                <div className="text-xs text-slate-500">{c.meta}</div>
              </button>
            ))}
          </div>
        </div>
        )}
      </aside>

      <section className="card flex h-[75vh] min-h-[480px] flex-col">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center py-16 text-center text-slate-500">
              <div>
                <BookOpenCheck className="mx-auto mb-3 h-10 w-10 text-violet-500" />
                {ready ? (
                  <>
                    <p className="font-medium text-slate-700 dark:text-slate-200">Ask about {subject.name} · {selectedChapter}</p>
                    <p className="text-sm">Type your question — answers come from CBSE board papers, marking schemes and EduGenie's solved questions.</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-slate-700 dark:text-slate-200">Pick a subject and chapter to start</p>
                    <p className="text-sm">Answers stay within the {selectedBoard} Class {selectedGrade} chapter you choose.</p>
                  </>
                )}
              </div>
            </div>
          )}
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-violet-600 px-4 py-2 text-white">
                {m.text && <MathText text={m.text} />}
              </div>
            ) : (
              <div key={m.id} className="max-w-[95%]">
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" /> EduGenie
                </div>
                {m.notice && <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">{m.notice}</p>}
                {m.matches && !m.asSuggestions && (
                  <div className="space-y-3">
                    {m.matches.length > 1 && <p className="text-sm text-slate-600 dark:text-slate-300">Closest questions and their answers:</p>}
                    {m.matches.map((q) => <BankAnswer key={q.id} q={q} />)}
                  </div>
                )}
                {m.matches && m.asSuggestions && (
                  <div className="flex flex-col gap-2">
                    {m.matches.map((q) => (
                      <button key={q.id} onClick={() => ask(q.question, q)} className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-left text-sm hover:border-violet-400 dark:border-slate-700">
                        <MathText text={q.question.length > 160 ? q.question.slice(0, 160) + '…' : q.question} />
                      </button>
                    ))}
                  </div>
                )}
                {m.answer && <AnswerCard a={m.answer} board={selectedBoard} kind={m.kind} />}
                {m.error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {m.error}
                  </div>
                )}
              </div>
            ),
          )}
          {thinking && <div className="text-sm text-slate-500 animate-pulse">Searching CBSE board questions…</div>}
        </div>

        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          {ready && (
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="chip bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">{subject.name}</span>
              <span className="truncate">{selectedChapter}</span>
            </div>
          )}
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
            {ready && starters.map((q) => (
              <button key={q.id} onClick={() => ask(q.question, q)} className="chip max-w-[18rem] shrink-0 cursor-pointer bg-slate-100 py-1 text-slate-700 hover:bg-violet-100 dark:bg-slate-800 dark:text-slate-300" title={q.question}>
                <span className="truncate"><MathText text={q.question} /></span>
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!ready}
              placeholder={
                !ready
                  ? 'Choose a subject and chapter first'
                  : subject.kind === 'english' || subject.kind === 'hindi'
                    ? `Ask about ${selectedChapter} — characters, themes, devices, grammar…`
                    : `Type your ${subject.name} question…`
              }
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-slate-700"
            />
            <button type="submit" disabled={thinking || !ready} className="btn-primary !px-3" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
