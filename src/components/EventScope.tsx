import React, { ReactElement, useState } from 'react';
import { RawEvent } from '../types';

function EventScope(props: EventScopeProps) {
  const [filters] = useState<Array<EventFilter>>([]);

  let { events: filteredEvents } = props;
  filters.forEach((filter) => { filteredEvents = filteredEvents.filter(filter); });

  const { render } = props;
  return (
    <div>
      Event scope
      {filters.length}
      {render(filteredEvents)}
    </div>
  );
}

type EventFilter = (event: RawEvent) => boolean;
type EventConsumer = (events: Array<RawEvent>) => ReactElement;

interface EventScopeProps {events: Array<RawEvent>, render: EventConsumer}

export default EventScope;
