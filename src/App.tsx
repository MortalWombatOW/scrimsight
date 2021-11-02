// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import {
  AppBar, Box, Button, Toolbar,
} from '@mui/material';
import { RawEvent } from './types';
import Uploader from './components/Uploader';
import EventScope from './components/EventScope';
import ViewSelector from './components/ViewSelector';
import ZeroStateView from './components/ZeroStateView/ZeroStateView';

interface EventSummaryProps {
  events: Array<RawEvent>,
}

const EventSummary = (props: EventSummaryProps) => {
  const { events } = props;
  const maps = new Set<string>(events.map((e) => e.fileHash));
  const content = `Maps: ${maps.size.toLocaleString()}  Events: ${events.length.toLocaleString()}`;
  return (
    <div className="summary">
      {content}
    </div>
  );
};

interface AddViewButtonProps {
  addView: () => void;
}
// button to add a new view that drops down a list of view types
const AddViewButton = (props: AddViewButtonProps) => {
  const { addView } = props;
  return (
    <Button color="inherit" variant="outlined" onClick={addView}>Add Panel</Button>
  );
};

function App() {
  const [events, setEvents] = useState<Array<RawEvent>>([]);
  const [reports, setReports] = useState <number>(0);
  const addReport = () => setReports(reports + 1);
  const addEvents = (newEvents: Array<RawEvent>) => setEvents(events.concat(newEvents));
  return (
    <div>
      <AppBar position="static" className="appbar">
        <Toolbar>
          <img className="logoicon" src="/assets/owlogo.svg" alt="logo" />
          <span className="logo">
            scrimsight
          </span>
          <div className="navbuttons">
            <Uploader addEvents={addEvents} />
            <AddViewButton addView={addReport} />
            <EventSummary events={events} />
          </div>
        </Toolbar>
      </AppBar>
      <Box className="App">
        {reports === 0 ? <ZeroStateView />
          : Array(reports).fill(0).map((_, i) => (
            <EventScope
              events={events}
              render={
            (filteredEvents) => <ViewSelector events={filteredEvents} />
          }
            />
          ))}
      </Box>
    </div>
  );
}

export default App;
