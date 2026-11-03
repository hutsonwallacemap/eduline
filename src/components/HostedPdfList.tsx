import { BadgeCheck, BookOpen, Download, FileText } from 'lucide-react';
import type { Resource } from '../data/library';
import { useApp } from '../store';

/** Read / download buttons for a hosted PDF; a board-paper series gets one button per set. */
export function HostedPdfButtons({ r, compact }: { r: Resource; compact?: boolean }) {
  const setOpenPdf = useApp((s) => s.setOpenPdf);
  const size = compact ? '!px-2.5 !py-1 text-xs' : '!px-3 !py-1.5';
  if (r.parts)
    return (
      <>
        {r.parts.map((p) => (
          <button key={p.url} onClick={() => setOpenPdf({ title: `${r.title.replace(/ \(3 sets\)$/, '')} — ${p.label}`, url: p.url })} className={`btn-primary ${size}`}>
            <BookOpen className="h-4 w-4" /> {p.label}
          </button>
        ))}
      </>
    );
  return (
    <>
      <button onClick={() => setOpenPdf({ title: r.title, url: r.url })} className={`btn-primary ${size}`}>
        <BookOpen className="h-4 w-4" /> Read
      </button>
      <a href={r.url} download={r.url.split('/').pop()} className={`btn-ghost ${size}`} aria-label={`Download ${r.title}`}>
        <Download className="h-4 w-4" /> {compact ? '' : 'Download'}
      </a>
    </>
  );
}

/** Compact list of the hosted PDFs for a chapter, used in the notes reader and Board Prep. */
export default function HostedPdfList({ items }: { items: Resource[] }) {
  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
      {items.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5">
          <FileText className="h-4 w-4 shrink-0 text-violet-500" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium leading-snug">{r.title}</div>
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
              <span>{r.kind}</span>·<span>{r.source}</span>·<span>{r.pages} pages</span>
              {r.language !== 'English' && <>·<span>{r.language}</span></>}
              {(r.chapters?.length ?? 0) > 1 && <>·<span>covers {r.chapters!.length} chapters</span></>}
              {r.official && <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-label="Official" />}
            </div>
          </div>
          <div className="flex gap-1.5"><HostedPdfButtons r={r} compact /></div>
        </li>
      ))}
    </ul>
  );
}
