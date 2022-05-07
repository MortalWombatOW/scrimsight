import Home from './pages/Home/Home';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Map from './pages/Map/Map';
import ReportPage from './pages/ReportPage/ReportPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map/:mapId" element={<Map />} />
      <Route path="/report/" element={<ReportPage />} />
      <Route path="/report/:id" element={<ReportPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
