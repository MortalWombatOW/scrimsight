import Home from './pages/Home/Home';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Maps from './pages/Maps/Maps';
import Map from './pages/Map/Map';

import {GlobalStateProvider} from './lib/globalstate';

const App = () => (
  <GlobalStateProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/map/:mapId" element={<Map />} />
        {/* <Route path="report" element={<Reports />} />
      <Route path="report/:id" element={<Report />} /> */}
      </Routes>
    </BrowserRouter>
  </GlobalStateProvider>
);

export default App;
