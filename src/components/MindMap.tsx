import { Brain, Eye, EyeOff, Lightbulb, ListChecks, Sigma, Target } from 'lucide-react';
import { useState } from 'react';
import type { ChapterNote } from '../data/notes';
import MathText from './MathText';

interface Leaf {
  label: string; // short handle shown on the map (and as the cue in recall mode)
  detail: string; // the rest of the point (MathText)
  inline?: boolean; // the label is part of the detail text, so it isn't shown separately
}

interface Branch {
  title: string;
  icon: typeof Brain;
  tone: string; // border + text colour
  dot: string;
  leaves: Leaf[];
}

/**
 * A recall cue from the opening of a point: its first few words with any maths kept whole. A formula that
 * opens with "lhs = …" becomes the question "lhs = ?".
 */
function cueOf(point: string): string {
  const tokens = point
    .replace(/\*\*/g, '')
    .split(/(\$[^$]+\$)/)
    .flatMap((part) => (part.startsWith('$') ? [part] : part.split(/\s+/).filter(Boolean)));
  let cue = '';
  let n = 0;
  for (const t of tokens) {
    if (t.startsWith('$') && t.includes('=')) return `${cue} $${t.slice(1, -1).split('=')[0].trim()} = ?$`.trim();
    cue += /^[,.;:)]/.test(t) ? t : ` ${t}`;
    if (++n >= 6) break;
  }
  return cue.trim().replace(/[,;.:]$/, '') + (n < tokens.length ? '…' : '');
}

/** A short label for a key point: its opening bold phrase, the text before a colon, or a recall cue from its first words. */
function labelOf(point: string): Leaf {
  const bold = point.match(/^\*\*([^*]{2,60}?):?\*\*:?\s*/);
  if (bold && point.length > bold[0].length) return { label: bold[1].replace(/:$/, ''), detail: point.slice(bold[0].length) };
  const colon = point.match(/^([^:$*]{3,48}):\s/);
  if (colon) return { label: colon[1], detail: point.slice(colon[0].length) };
  return { label: cueOf(point), detail: point, inline: true };
}

/** Builds the map's branches from a chapter note: concepts, formulas, key terms and exam tips. */
export function branchesOf(note: ChapterNote, hi: boolean): Branch[] {
  const b: Branch[] = [
    {
      title: hi ? 'मुख्य बिंदु' : 'Core ideas',
      icon: Lightbulb,
      tone: 'border-emerald-400 text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
      leaves: note.keyPoints.map(labelOf),
    },
  ];
  if (note.formulas?.length)
    b.push({
      title: hi ? 'सूत्र' : 'Formulas',
      icon: Sigma,
      tone: 'border-indigo-400 text-indigo-700 dark:text-indigo-300',
      dot: 'bg-indigo-500',
      leaves: note.formulas.map((f) => {
        const [name, ...rest] = f.split(/:\s/);
        return rest.length && !name.includes('$') && name.length < 40
          ? { label: name.replace(/\*\*/g, ''), detail: rest.join(': ') }
          : { label: cueOf(f), detail: f, inline: true };
      }),
    });
  if (note.terms?.length)
    b.push({
      title: hi ? 'प्रमुख शब्द' : 'Key terms',
      icon: ListChecks,
      tone: 'border-sky-400 text-sky-700 dark:text-sky-300',
      dot: 'bg-sky-500',
      leaves: note.terms.map((t) => ({ label: t.term, detail: t.meaning })),
    });
  b.push({
    title: hi ? 'परीक्षा की दृष्टि से' : 'Exam tips',
    icon: Target,
    tone: 'border-amber-400 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    leaves: note.examFocus.map(labelOf),
  });
  return b;
}

/**
 * EduGenie mind map for a chapter, generated from its original notes: the chapter in the centre and a
 * branch for each part of the notes. Recall mode hides the details so students test themselves first,
 * then tap a node to check.
 */
export default function MindMap({ note }: { note: ChapterNote }) {
  const hi = note.subject === 'Hindi';
  const branches = branchesOf(note, hi);
  const [recall, setRecall] = useState(false);
  const [shown, setShown] = useState<Set<string>>(new Set());
  const title = note.chapter.includes(': ') ? note.chapter.split(': ')[1] : note.chapter;
  const toggle = (id: string) =>
    setShown((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <button
          onClick={() => {
            setRecall((r) => !r);
            setShown(new Set());
          }}
          className={recall ? 'btn-primary !px-3 !py-1.5' : 'btn-ghost !px-3 !py-1.5'}
          aria-pressed={recall}
        >
          {recall ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {hi ? 'स्वयं जाँचें' : 'Recall mode'}
        </button>
        <span className="text-xs text-slate-500">
          {recall
            ? hi
              ? 'हर बिंदु को पहले याद करें, फिर उस पर टैप करके जाँचें।'
              : 'Say each point from memory, then tap it to check.'
            : hi
              ? 'पूरा अध्याय एक नज़र में।'
              : 'The whole chapter at a glance. Turn on recall mode to test yourself.'}
        </span>
      </div>

      <div className="relative">
        {/* centre */}
        <div className="mx-auto mb-5 w-fit max-w-full rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 px-6 py-4 text-center text-white shadow-lg print:border print:border-slate-400 print:bg-none print:text-black print:shadow-none">
          <Brain className="mx-auto mb-1 h-6 w-6 opacity-80" />
          <div className="text-lg font-bold leading-tight">{title}</div>
          <div className="mt-1 max-w-md text-xs text-white/85 print:text-slate-600"><MathText text={note.overview} /></div>
        </div>

        {/* branches */}
        <div className="grid gap-4 md:grid-cols-2">
          {branches.map((b, bi) => (
            <section key={b.title} className={`rounded-2xl border-l-4 bg-slate-50 p-3 break-inside-avoid dark:bg-slate-800/50 ${b.tone}`}>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                <b.icon className="h-4 w-4" /> {b.title}
                <span className="ml-auto rounded-full bg-white px-2 text-xs font-medium text-slate-500 dark:bg-slate-900">{b.leaves.length}</span>
              </h4>
              <ul className="space-y-1.5">
                {b.leaves.map((l, li) => {
                  const id = `${bi}-${li}`;
                  const hidden = recall && !shown.has(id);
                  return (
                    <li key={id}>
                      <button
                        onClick={() => recall && toggle(id)}
                        className={`flex w-full gap-2 rounded-xl bg-white p-2.5 text-left text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200 ${recall ? 'cursor-pointer hover:ring-2 hover:ring-violet-300' : 'cursor-default'}`}
                        aria-expanded={recall ? !hidden : undefined}
                      >
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${b.dot}`} />
                        <span className="min-w-0">
                          {hidden ? (
                            <>
                              <span className="font-semibold"><MathText text={l.label} /></span>
                              <span className="ml-2 text-xs text-violet-500">{hi ? 'याद करें, फिर टैप करें' : 'recall, then tap'}</span>
                            </>
                          ) : l.inline ? (
                            <MathText text={l.detail} />
                          ) : (
                            <>
                              <span className="font-semibold"><MathText text={l.label} /></span>
                              <span className="block text-xs text-slate-500 dark:text-slate-400"><MathText text={l.detail} /></span>
                            </>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
