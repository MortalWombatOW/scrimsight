import React from 'react';
import { initDB } from 'react-indexed-db';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import DBConfig from './lib/data/dbconfig';

initDB(DBConfig);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="report" element={<Reports />} />
      <Route path="report/:id" element={<Report />} />
    </Routes>
  </BrowserRouter>
);

export default App;
