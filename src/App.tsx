import Home from './pages/Home/Home';
import React from 'react';
import {initDB} from 'react-indexed-db';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import DBConfig from './lib/data/dbconfig';
import {keys} from 'ts-transformer-keys';

initDB(DBConfig);

type props = {
  test: string;
  vnumber: number;
};

console.log(keys<props>());

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="report" element={<Reports />} />
      <Route path="report/:id" element={<Report />} /> */}
    </Routes>
  </BrowserRouter>
);

export default App;
