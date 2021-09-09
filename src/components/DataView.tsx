import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { RawEvent, StrIndexable } from '../types';

const DataView = (props: DataViewProps) => {
  const { events } = props;
  const tableRef = useRef<HTMLTableElement>(null);

  const numRows = 50;

  useEffect(() => {
    if (events.length === 0) return;

    const columnNames = Object.keys(events[0]);
    const table = select(tableRef.current);

    table.selectChildren().remove();

    table.append('thead').append('tr').selectAll('th')
      .data(columnNames)
      .enter()
      .append('th')
      .text((d) => d);

    const rows = table.append('tbody').selectAll('tr').data(events.slice(0, numRows)).enter()
      .append('tr');
    rows.selectAll('td').data((d) => columnNames.map((k) => ({ name: k, value: (d as StrIndexable)[k] }))).enter()
      .append('td')
      .attr('data-th', (d) => d.name)
      .text((d) => d.value);
  });

  if (events.length === 0) {
    return (
      <div>
        No data to display.
      </div>
    );
  }

  return (
    <div>
      <table ref={tableRef} />
    </div>
  );
};

interface DataViewProps {
  events: Array<RawEvent>
}

export default DataView;
