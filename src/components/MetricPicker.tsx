import { ChevronDown } from 'lucide-react';
import { PlayerStatsNumericalKeys } from '../lib/ScrimsightDataModel';

interface MetricPickerProps {
  metrics: PlayerStatsNumericalKeys[];
  selected: string;
  onChange: (metric: PlayerStatsNumericalKeys) => void;
}

const MetricPicker = ({ metrics, selected, onChange }: MetricPickerProps) => {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-sm w-full justify-between">
        <span className="truncate">{selected}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        {metrics.map((metric) => (
          <li key={metric}>
            <a
              onClick={() => onChange(metric)}
              className={selected === metric ? 'active' : ''}
            >
              {metric}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MetricPicker;