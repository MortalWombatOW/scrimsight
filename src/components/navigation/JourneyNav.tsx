import { NavLink, useNavigate } from 'react-router-dom';
import { MdMonitorHeart } from 'react-icons/md';
import { TbMessageReport, TbTargetArrow } from 'react-icons/tb';
import { IoTrendingUp } from 'react-icons/io5';
import { RiCompass3Line } from 'react-icons/ri';
import { FiPlus } from 'react-icons/fi';
import { useFocus } from '../../hooks/useFocus';
import { FocusMode } from '../../data/focusAtom';

interface JourneyItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const journeys: JourneyItem[] = [
  { label: 'Pulse', path: '/', icon: <MdMonitorHeart size={18} /> },
  { label: 'Debrief', path: '/debrief', icon: <TbMessageReport size={18} /> },
  { label: 'Train', path: '/train', icon: <TbTargetArrow size={18} /> },
  { label: 'Progress', path: '/progress', icon: <IoTrendingUp size={18} /> },
  { label: 'Explore', path: '/explore', icon: <RiCompass3Line size={18} /> },
];

function FocusSelector() {
  const {
    mode, teamName, playerName,
    availableTeams, availablePlayers,
    setMode, setTeam, setPlayer, hasData,
  } = useFocus();

  if (!hasData) return null;

  const modes: FocusMode[] = ['team', 'player'];

  return (
    <div className="flex items-center gap-1.5">
      {/* Mode toggle */}
      <div className="flex rounded-lg bg-base-300/60 p-0.5">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-2 py-0.5 text-xs font-medium rounded-md capitalize transition-colors ${
              mode === m
                ? 'bg-primary/20 text-primary'
                : 'text-base-content/40 hover:text-base-content/60'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Entity dropdown */}
      {mode === 'team' ? (
        <select
          value={teamName ?? ''}
          onChange={(e) => setTeam(e.target.value || null)}
          className="select select-xs bg-base-300/60 border-none text-sm font-medium focus:outline-none max-w-[160px]"
        >
          <option value="">Auto</option>
          {availableTeams.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      ) : (
        <select
          value={playerName ?? ''}
          onChange={(e) => setPlayer(e.target.value || null)}
          className="select select-xs bg-base-300/60 border-none text-sm font-medium focus:outline-none max-w-[180px]"
        >
          <option value="">Select player</option>
          {availablePlayers.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name} ({p.role})
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export function JourneyNav() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-1 px-4 h-12 border-b border-base-content/10 overflow-x-auto">
      {journeys.map(({ label, path, icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-base-content/60 hover:text-base-content hover:bg-base-300/50'
            }`
          }
        >
          {icon}
          <span>{label}</span>
        </NavLink>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Focus selector */}
      <FocusSelector />

      <button
        onClick={() => navigate('/files')}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-base-content/60 hover:text-base-content hover:bg-base-300/50 transition-colors whitespace-nowrap"
        title="Upload files"
      >
        <FiPlus size={16} />
        <span className="hidden sm:inline">Upload</span>
      </button>
    </nav>
  );
}
