import { X } from 'lucide-react';
import { STREAMS } from '../data/curriculum';
import { useApp } from '../store';

export default function StreamModal() {
  const { streamModalOpen, selectedGrade, selectedStream, setStream, setStreamModalOpen, setGrade } = useApp();
  if (!streamModalOpen) return null;

  // Closing without choosing on a fresh senior grade falls back to Class 10, since 11–12 need a stream.
  const close = () => (selectedStream === 'General' ? setGrade(10) : setStreamModalOpen(false));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" onClick={close}>
      <div className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Choose your Class {selectedGrade} stream</h2>
          <button onClick={close} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-500">Senior secondary subjects depend on your stream.</p>
        <div className="grid gap-2">
          {STREAMS.map((st) => (
            <button
              key={st.value}
              onClick={() => setStream(st.value)}
              className={`cursor-pointer rounded-xl border p-3 text-left transition hover:border-violet-400 ${
                selectedStream === st.value
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="font-medium">{st.value}</div>
              <div className="text-sm text-slate-500">{st.blurb}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
