/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';

import {
  ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import { RawEvent, StrIndexable, ViewType } from '../types';
import DataTable from './DataTable/DataTable';
import DataPlot from './DataPlot/DataPlot';
import { stringHash } from '../shared';
import MapOverlay from './MapOverlay/MapOverlay';

const ViewSelector = (props: ViewSelectorProps) => {
  const [view, setView] = useState<ViewType>(0);

  const getUniqueValues = (data: RawEvent[], key: string) => {
    const counts: Map<string, number> = new Map<string, number>();
    data.forEach((event: StrIndexable) => {
      const value = event[key];
      counts.set(event[key], value === undefined ? 1 : value + 1);
    });
    return Array.from(counts.keys());
  };

  const getData = (events: RawEvent[], xField: string, yField: string, cField: string) => {
    const numericEvents = events.filter(
      (event) => !Number.isNaN(Number((event as StrIndexable)[xField]))
       && !Number.isNaN(Number((event as StrIndexable)[yField])),
    );
    return numericEvents.map((event) => [
      Number((event as StrIndexable)[xField]),
      Number((event as StrIndexable)[yField]),
      stringHash((event as StrIndexable)[cField]),
    ]);
  };

  return (
    <div className="viewselectorwrapper">
      <div>
        {(!(view === 0)) ? '' : (
          <DataTable events={props.events} />
        )}

        {(!(view === 1)) ? '' : (
          <DataPlot
            data={getData(props.events, 'timestamp', 'value2', 'value1')}
            width={800}
            height={600}
            legend={getUniqueValues(props.events, 'value1')}
          />
        )}

        {(!(view === 2)) ? '' : (
          <MapOverlay
            data={[[0, 1, 2], [1, 2, 3], [2, 3, 4]]}
            width={800}
            height={600}
            map="busan"
          />
        )}
      </div>
      <div className="viewselector">
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, v) => setView(v)}
        >
          <ToggleButton value={0} aria-label="left aligned">
            Table
          </ToggleButton>
          <ToggleButton value={1} aria-label="centered">
            Plot
          </ToggleButton>
          <ToggleButton value={2} aria-label="right aligned">
            Map
          </ToggleButton>
        </ToggleButtonGroup>

      </div>
    </div>
  );
};

interface ViewSelectorProps {
  events: Array<RawEvent>
}

export default ViewSelector;
