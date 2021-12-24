import React from 'react';
import {Dataset} from '../../lib/data/types';

type DisplayControlProps = {
  dataset: Dataset;
  setMode: (mode: string) => void;
  currentMode: string;
};

const DisplayControl = (props: DisplayControlProps) => {
  const {dataset, setMode} = props;
  const modes = [['Table', 'table']];

  if (dataset.columns.filter((col) => col.type === 'number').length >= 2) {
    modes.push(['Chart', 'chart']);
  }

  if (dataset.columns.map((col) => col.name).includes('position')) {
    modes.push(['Map', 'map']);
  }

  return (
    <div>
      {modes.map(([name, mode]) => (
        <button
          key={mode}
          onClick={() => setMode(mode)}
          className={props.currentMode === mode ? 'active' : ''}>
          {name}
        </button>
      ))}
    </div>
  );
};

export default DisplayControl;
