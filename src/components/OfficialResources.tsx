import { BadgeCheck, ExternalLink, MapPin, School } from 'lucide-react';
import { useState } from 'react';
import { CISCE_URL, STATE_BOARDS } from '../data/officialLinks';
import { useApp } from '../store';

const linkBtn = 'btn-ghost !justify-between !px-3 !py-2 w-full';

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkBtn}>
      <span className="flex items-center gap-2 text-left">{children}</span>
      <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
    </a>
  );
}

/** Official portals for boards other than CBSE (CBSE papers are listed in full on the Papers page). */
export default function OfficialResources() {
  const { selectedBoard } = useApp();
  const [state, setState] = useState('');
  const board = STATE_BOARDS.find((b) => b.state === state);

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <BadgeCheck className="h-5 w-5 text-emerald-600" />
        <h2 className="text-lg font-semibold">ICSE and State Board papers</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={`card p-5 ${selectedBoard === 'ICSE' ? 'ring-2 ring-violet-400' : ''}`}>
          <div className="mb-1 flex items-center gap-2 font-semibold"><School className="h-5 w-5 text-indigo-600" /> CISCE (ICSE / ISC)</div>
          <p className="mb-3 text-sm text-slate-500">Specimen question papers for ICSE (Class 10) and ISC (Class 12) are published on the CISCE website.</p>
          <Ext href={CISCE_URL}>CISCE official website</Ext>
        </div>

        <div className={`card p-5 ${selectedBoard === 'State Board' ? 'ring-2 ring-violet-400' : ''}`}>
          <div className="mb-1 flex items-center gap-2 font-semibold"><MapPin className="h-5 w-5 text-emerald-600" /> State Boards</div>
          <p className="mb-3 text-sm text-slate-500">Pick your state to open its board’s official site for model papers and past papers.</p>
          <select className="select mb-3 w-full !py-2" value={state} onChange={(e) => setState(e.target.value)} aria-label="State">
            <option value="">Select your state…</option>
            {STATE_BOARDS.map((b) => <option key={b.state}>{b.state}</option>)}
          </select>
          {board ? (
            <Ext href={board.url}>{board.board}</Ext>
          ) : (
            <p className="text-xs text-slate-400">Your board’s link appears here.</p>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">Links open the board’s own website in a new tab. EduGenie is not affiliated with any board.</p>
    </section>
  );
}
