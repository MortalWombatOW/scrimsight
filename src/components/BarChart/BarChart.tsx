import React, {useState} from 'react';

const BarChart = ({mapId}: {mapId: number}) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div>BarChart</div>
      <div>
        <button onClick={() => setSelected('a')}>a</button>
        <button onClick={() => setSelected('b')}>b</button>
        <button onClick={() => setSelected('c')}>c</button>
      </div>
    </div>
  );
};

export default BarChart;
