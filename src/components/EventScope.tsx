/* eslint-disable no-console */
// import { select } from 'd3-selection';
import { ButtonGroup, Button } from '@mui/material';
import React, { ReactElement, useState } from 'react';
import { EventFilter, RawEvent } from '../types';
import FieldButton from './FieldButton';

function EventScope(props: EventScopeProps) {
  const [filters, setFilters] = useState<Array<EventFilter>>([]);
  // const filtersRef = useRef<HTMLSpanElement>(null);
  const addFilter = (filter: EventFilter) => {
    setFilters(filters.concat(filter));
  };
  let { events: filteredEvents } = props;
  filters.forEach((filter) => { filteredEvents = filteredEvents.filter(filter.eval); });
  console.log(filters);
  console.log(filteredEvents);
  const { render } = props;

  if (filteredEvents.length === 0) return <div />;

  const fields = Object.keys(filteredEvents[0]);

  // useEffect(() => {
  //   if (filteredEvents.length === 0) return;

  //   const fields = Object.keys(filteredEvents[0]);
  //   const filtersDiv = select(filtersRef.current);

  //   filtersDiv.selectChildren().remove();

  //   filtersDiv.selectAll('input').data(fields).enter().append('input')
  //     .attr('type', () => 'button')
  //     .attr('value', (d) => d)
  //     .on('click', (e) => {
  //       const field = select(e.target).property('value');

  //       const values = filteredEvents.map((evt) => (evt as StrIndexable)[field]);

  //       if (values.every((v) => typeof v === 'number')) {
  //         filtersDiv.append('span').selectAll('input');
  //       } else {
  //         const dist = getUniqueValuesWithFrequency(values);
  //         // open menu

  //         filtersDiv.append('span').selectAll('input').data(dist.entries()).enter()
  //           .append('input')
  //           .attr('type', () => 'button')
  //           .attr('data-field', (d) => field)
  //           .attr('data-value', (d) => d[0])
  //           .attr('value', (d) => `${d[0]}: ${d[1]}`)
  //           .on('click', (e2) => {
  //             const button = select(e2.target);
  //             const dataField = button.attr('data-field');
  //             const dataValue = button.attr('data-value');
  //             const newFilter: EventFilter = {
  //               constraint: `${dataField} = '${dataValue}'`,
  //               eval: (evt) => (evt as StrIndexable)[dataField] === dataValue,
  //             };
  //             setFilters(filters.concat([newFilter]));
  //           });
  //       }
  //     });
  // });

  return (
    <div className="eventscope">
      {/* <span className="filters" ref={filtersRef} /> */}
      <ButtonGroup aria-label="contained primary button group" className="fields">
        {fields.map((name) => (
          <div>
            <FieldButton fieldName={name} events={filteredEvents} addFilter={addFilter} />
          </div>
        ))}
        <div>
          <Button
            variant="contained"
            onClick={() => setFilters([])}
          >
            Clear Filters
          </Button>
        </div>
      </ButtonGroup>
      {render(filteredEvents)}
    </div>
  );
}

type EventConsumer = (events: Array<RawEvent>) => ReactElement;

interface EventScopeProps { events: Array<RawEvent>, render: EventConsumer }

export default EventScope;
