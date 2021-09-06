import React from 'react';
import { useState } from "react";
import BarChartData from './components/BarChartData'
import Uploader from './components/Uploader';

function App() {
  const [events, setEvents] = useState([]);

  const addEvents = (newEvents) => setEvents(events.append(newEvents))

  return (
    <div>
      <Uploader addEvents/>
      <BarChartData />
    </div>
  )
}

export default App;