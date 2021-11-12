// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import {
  Box,
} from '@mui/material';
import ZeroStateView from '../ZeroState/ZeroStateView';
import {
  createRawEventDataset,
} from '../../lib/data/data';
import Dataset from './services/Dataset';
import Report from '../Report/Report';
import Header from '../Header/Header';

function App() {
  const [dataset, setDataset] = useState<Dataset>(createRawEventDataset([]));
  const mergeNewData = (newData: Dataset) => {
    setDataset(dataset.merge(newData));
  };
  return (
    <div className="App">
      <Header mergeNewData={mergeNewData} dataset={dataset} />
      <Box className="pageContent">
        {dataset.numRows() === 0 ? <ZeroStateView addData={mergeNewData} />
          : <Report dataset={dataset} />}
      </Box>
    </div>
  );
}

export default App;
