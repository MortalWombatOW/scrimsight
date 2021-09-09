// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import './App.css';
import { RawEvent } from './types';
import Uploader from './components/Uploader';
import EventScope from './components/EventScope';
import DataView from './components/DataView';

function App() {
  const [events, setEvents] = useState<Array<RawEvent>>([]);
  const addEvents = (newEvents: Array<RawEvent>) => setEvents(events.concat(newEvents));
  return (
    <div className="App">
      <Uploader addEvents={addEvents} />
      {events.length}
      <EventScope
        events={events}
        render={
        (filteredEvents) => (<DataView events={filteredEvents} />)
}
      />
    </div>
  );
}

export default App;
