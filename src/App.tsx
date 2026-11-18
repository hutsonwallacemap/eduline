import { useEffect } from 'react';
import Header from './components/Header';
import NotesReader from './components/NotesReader';
import PdfViewer from './components/PdfViewer';
import StreamModal from './components/StreamModal';
import { useApp } from './store';
import BoardPrep from './views/BoardPrep';
import Dashboard from './views/Dashboard';
import Library from './views/Library';
import DoubtSolver from './views/DoubtSolver';
import Practice from './views/Practice';
import Revision from './views/Revision';
import Papers from './views/Papers';

export default function App() {
  const { view, theme } = useApp();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {view === 'dashboard' && <Dashboard />}
        {view === 'prep' && <BoardPrep />}
        {view === 'library' && <Library />}
        {view === 'doubts' && <DoubtSolver />}
        {view === 'practice' && <Practice />}
        {view === 'revision' && <Revision />}
        {view === 'papers' && <Papers />}
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Built by <span className="font-medium text-slate-700 dark:text-slate-200">Sam Hutson Wallace</span> and{' '}
        <span className="font-medium text-slate-700 dark:text-slate-200">Cynthika Wallace</span>
      </footer>
      <StreamModal />
      <NotesReader />
      <PdfViewer />
    </div>
  );
}
