import { AlertTriangle, BookOpenCheck, ChevronDown, ImagePlus, Lightbulb, ListOrdered, Send, Sigma, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MathText from '../components/MathText';
import SubjectChapterPicker, { useSelectedSubject } from '../components/SubjectChapterPicker';
import type { SubjectKind } from '../data/curriculum';
import { chipsFor, mockAnswer, SEED_CONVERSATIONS, type AiAnswer, type ChatMessage, type Conversation } from '../data/doubts';
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

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Splits a data URL into the base64 image block the server forwards to Claude. */
const toImagePayload = (dataUrl: string) => {
  const [, mediaType, data] = dataUrl.match(/^data:(image\/[a-z]+);base64,(.*)$/) ?? [];
  return { mediaType, data };
};

/** Prior turns as plain text, so follow-up questions keep their context. */
const toHistory = (msgs: ChatMessage[]) =>
  msgs
    .filter((m) => m.text || m.answer || m.image)
    .slice(-10)
    .map((m) =>
      m.role === 'user'
        ? { role: 'user' as const, text: m.text ?? '(textbook photo)' }
        : { role: 'assistant' as const, text: m.answer ? `${m.answer.steps}

Rule used: ${m.answer.formula}

Tip: ${m.answer.pitfall}` : '' },
    )
    .filter((m) => m.text);

export default function DoubtSolver() {
  const { selectedBoard, selectedGrade, selectedStream, selectedChapter } = useApp();
  const subject = useSelectedSubject();
  const ready = !!subject && !!selectedChapter;
  const [convos, setConvos] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [activeId, setActiveId] = useState(SEED_CONVERSATIONS[1].id);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const active = convos.find((c) => c.id === activeId)!;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [active?.messages.length, thinking]);

  const ask = async (text: string) => {
    if ((!text.trim() && !image) || thinking || !subject || !selectedChapter) return;
    const chapter = selectedChapter;
    const uid = crypto.randomUUID();
    const userMsg: ChatMessage = { id: uid, role: 'user', text: text.trim() || undefined, image: image ?? undefined };
    const isNew = activeId === 'new';
    const targetId = isNew ? uid : activeId;
    const prior = isNew ? [] : active.messages;
    const append = (m: ChatMessage) =>
      setConvos((cs) => cs.map((c) => (c.id === targetId ? { ...c, messages: [...c.messages, m] } : c)));

    setConvos((cs) =>
      // A question from the "New doubt" state starts a new conversation.
      isNew
        ? [{ id: uid, title: text.trim() || 'Textbook photo', meta: `Class ${selectedGrade} · ${subject.name} · ${chapter}`, messages: [userMsg] }, ...cs]
        : cs.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, userMsg] } : c)),
    );
    setActiveId(targetId);
    setInput('');
    setImage(null);
    setThinking(true);

    try {
      const res = await fetch('/api/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: selectedBoard,
          grade: selectedGrade,
          stream: selectedStream,
          subject: subject.name,
          chapter,
          question: text.trim(),
          image: image ? toImagePayload(image) : undefined,
          history: toHistory(prior),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setDemoMode(false);
        append({ id: crypto.randomUUID(), role: 'ai', answer: body as AiAnswer, kind: subject.kind });
      } else if (body.error === 'no_credentials') {
        // No API key on the server: keep the app usable with the curated demo answers.
        setDemoMode(true);
        append({ id: crypto.randomUUID(), role: 'ai', answer: mockAnswer(text, !!image, subject.kind, subject.name, chapter), kind: subject.kind });
      } else {
        append({ id: crypto.randomUUID(), role: 'ai', error: body.message ?? `Request failed (${res.status}).` });
      }
    } catch {
      append({ id: crypto.randomUUID(), role: 'ai', error: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setThinking(false);
    }
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
        <div className="card p-3">
          <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Recent doubts</h3>
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
      </aside>

      <section className="card flex h-[75vh] min-h-[480px] flex-col">
        {demoMode && (
          <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Demo answers — add ANTHROPIC_API_KEY to .env.local and restart the dev server for live answers from Claude.
          </div>
        )}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center py-16 text-center text-slate-500">
              <div>
                <BookOpenCheck className="mx-auto mb-3 h-10 w-10 text-violet-500" />
                {ready ? (
                  <>
                    <p className="font-medium text-slate-700 dark:text-slate-200">Ask about {subject.name} · {selectedChapter}</p>
                    <p className="text-sm">Type a question, pick a sample, or upload a textbook photo.</p>
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
                {m.image && <img src={m.image} alt="Uploaded textbook" className="mb-2 max-h-48 rounded-lg" />}
                {m.text && <MathText text={m.text} />}
              </div>
            ) : (
              <div key={m.id} className="max-w-[95%]">
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" /> EduGenie
                </div>
                {m.answer && <AnswerCard a={m.answer} board={selectedBoard} kind={m.kind} />}
                {m.error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {m.error}
                  </div>
                )}
              </div>
            ),
          )}
          {thinking && <div className="text-sm text-slate-500 animate-pulse">EduGenie is working through the steps…</div>}
        </div>

        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          {ready && (
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="chip bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">{subject.name}</span>
              <span className="truncate">{selectedChapter}</span>
            </div>
          )}
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
            {ready && chipsFor(subject.kind, selectedChapter).map((c) => (
              <button key={c} onClick={() => ask(c)} className="chip shrink-0 cursor-pointer bg-slate-100 py-1 text-slate-700 hover:bg-violet-100 dark:bg-slate-800 dark:text-slate-300">
                <MathText text={c} />
              </button>
            ))}
          </div>
          {image && (
            <div className="relative mb-2 inline-block">
              <img src={image} alt="Preview" className="h-16 rounded-lg" />
              <button onClick={() => setImage(null)} className="absolute -right-2 -top-2 rounded-full bg-slate-900 p-0.5 text-white" aria-label="Remove image">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (!f) return;
                if (f.size > MAX_IMAGE_BYTES) return alert('Please choose a photo under 5 MB.');
                const reader = new FileReader();
                reader.onload = () => setImage(reader.result as string);
                reader.readAsDataURL(f);
              }}
            />
            <button type="button" disabled={!ready} onClick={() => fileRef.current?.click()} className="btn-ghost !px-3" aria-label="Upload textbook photo">
              <ImagePlus className="h-4 w-4" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!ready}
              placeholder={
                !ready
                  ? 'Choose a subject and chapter first'
                  : subject.kind === 'english' || subject.kind === 'hindi'
                    ? `Ask about ${selectedChapter} — characters, themes, devices, grammar…`
                    : 'Type your doubt — use $...$ for maths, e.g. $x^2 + 1$'
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
