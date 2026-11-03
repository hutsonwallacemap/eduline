import { Download, ExternalLink, FileText, X } from 'lucide-react';
import { useEffect } from 'react';
import { useApp } from '../store';

/** In-app reader for PDFs hosted on this site. Phones without a built-in PDF viewer get open/download buttons instead. */
export default function PdfViewer() {
  const { openPdf, setOpenPdf } = useApp();

  useEffect(() => {
    if (!openPdf) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenPdf(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openPdf, setOpenPdf]);

  if (!openPdf) return null;
  const inline = navigator.pdfViewerEnabled !== false;
  const file = openPdf.url.split('/').pop();

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/70 p-2 sm:p-4" onClick={() => setOpenPdf(null)}>
      <div className="card flex h-[94vh] w-full max-w-5xl flex-col overflow-hidden" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={openPdf.title}>
        <header className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <FileText className="h-5 w-5 shrink-0 text-violet-600" />
          <h2 className="min-w-0 flex-1 truncate font-semibold">{openPdf.title}</h2>
          <a href={openPdf.url} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-3 !py-1.5" title="Open in a new tab">
            <ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">New tab</span>
          </a>
          <a href={openPdf.url} download={file} className="btn-ghost !px-3 !py-1.5" title="Download">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
          </a>
          <button onClick={() => setOpenPdf(null)} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close PDF"><X className="h-5 w-5" /></button>
        </header>
        {inline ? (
          <iframe src={`${openPdf.url}#view=FitH`} title={openPdf.title} className="w-full flex-1 bg-slate-100 dark:bg-slate-900" />
        ) : (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <div className="max-w-sm space-y-3">
              <FileText className="mx-auto h-12 w-12 text-violet-500" />
              <p className="text-sm text-slate-500">This browser can’t show PDFs inside a page. Open it in the phone’s PDF viewer or save it for offline study.</p>
              <div className="flex justify-center gap-2">
                <a href={openPdf.url} target="_blank" rel="noopener noreferrer" className="btn-primary"><ExternalLink className="h-4 w-4" /> Open PDF</a>
                <a href={openPdf.url} download={file} className="btn-ghost"><Download className="h-4 w-4" /> Download</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
