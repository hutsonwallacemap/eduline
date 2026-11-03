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
      <StreamModal />
      <NotesReader />
      <PdfViewer />
    </div>
  );
}
