import { select } from 'd3-selection';
import React, {
  ReactElement, useEffect, useRef, useState,
} from 'react';
import { RawEvent, StrIndexable } from '../types';

function getUniqueValuesWithFrequency(arr: Array<string | number>): Map<string | number, number> {
  return arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
}

function EventScope(props: EventScopeProps) {
  const [filters, setFilters] = useState<Array<EventFilter>>([]);
  const filtersRef = useRef<HTMLDivElement>(null);

  let { events: filteredEvents } = props;
  filters.forEach((filter) => { filteredEvents = filteredEvents.filter(filter); });

  const { render } = props;

  useEffect(() => {
    if (filteredEvents.length === 0) return;

    const fields = Object.keys(filteredEvents[0]);
    const filtersDiv = select(filtersRef.current);

    filtersDiv.selectChildren().remove();

    filtersDiv.selectAll('input').data(fields).enter().append('input')
      .attr('type', () => 'button')
      .attr('value', (d) => d)
      .on('click', (e) => {
        const field = select(e.target).property('value');

        const values = filteredEvents.map((evt) => (evt as StrIndexable)[field]);

        if (values.every((v) => typeof v === 'number')) {
          filtersDiv.append('div').selectAll('input');
        } else {
          const dist = getUniqueValuesWithFrequency(values);
          filtersDiv.append('div').selectAll('input').data(dist.entries()).enter()
            .append('input')
            .attr('type', () => 'button')
            .attr('data-field', (d) => field)
            .attr('data-value', (d) => d[0])
            .attr('value', (d) => `${d[0]}: ${d[1]}`)
            .on('click', (e2) => {
              const button = select(e2.target);
              console.log(button);
              const dataField = button.attr('data-field');
              const dataValue = button.attr('data-value');
              console.log(`adding filter evt.${dataField} = ${dataValue}`);
              setFilters(filters.concat([(evt) => (evt as StrIndexable)[dataField] === dataValue]));
            });
        }
      });
  });

  return (
    <div>
      Event scope
      <div className="filters" ref={filtersRef} />
      {filters.length}
      {render(filteredEvents)}
    </div>
  );
}

type EventFilter = (event: RawEvent) => boolean;
type EventConsumer = (events: Array<RawEvent>) => ReactElement;

interface EventScopeProps {events: Array<RawEvent>, render: EventConsumer}

export default EventScope;
