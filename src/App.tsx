import Home from './pages/Home/Home';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {setupDB} from './lib/data/database';
import Maps from './pages/Maps/Maps';

setupDB();

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/maps" element={<Maps />} />
      {/* <Route path="report" element={<Reports />} />
      <Route path="report/:id" element={<Report />} /> */}
    </Routes>
  </BrowserRouter>
);

export default App;
