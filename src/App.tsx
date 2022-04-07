import Home from './pages/Home/Home';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Maps from './components/MapsList/MapsList';
import Map from './pages/Map/Map';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map/:mapId" element={<Map />} />
      {/* <Route path="report" element={<Reports />} />
      <Route path="report/:id" element={<Report />} /> */}
    </Routes>
  </BrowserRouter>
);

export default App;
