// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import {
  AppBar, Box, Toolbar,
} from '@mui/material';
import Uploader from './components/Uploader';
import ZeroStateView from './components/ZeroStateView/ZeroStateView';
import {
  applyTransforms, createRawEventDataset, Dataset, fieldTransforms,
} from './data';
import Report from './components/Report/Report';

interface EventSummaryProps {
  dataset: Dataset,
}

const DataSummary = (props: EventSummaryProps) => {
  const { dataset } = props;

  console.log(applyTransforms(dataset, fieldTransforms.get('raw_event')!.get('map')!.slice(0, 1)));

  const maps = applyTransforms(dataset, fieldTransforms.get('raw_event')!.get('map')!).selectDistinct('map');
  const content = `Maps: ${maps.numRows().toLocaleString()}  Events: ${dataset.numRows().toLocaleString()}`;
  return (
    <div className="summary">
      {content}
    </div>
  );
};

function App() {
  const [dataset, setDataset] = useState<Dataset>(createRawEventDataset([]));
  const mergeNewData = (newData: Dataset) => {
    setDataset(dataset.merge(newData));
  };
  return (
    <div>
      <AppBar position="static" className="appbar">
        <Toolbar>
          <img className="logoicon" src="/assets/owlogo.svg" alt="logo" />
          <span className="logo">
            scrimsight
          </span>
          <div className="navbuttons">
            <Uploader addData={mergeNewData} />
            <DataSummary dataset={dataset} />
          </div>
        </Toolbar>
      </AppBar>
      <Box className="App">
        {dataset.numRows() === 0 ? <ZeroStateView />
          : <Report dataset={dataset} />}
      </Box>
    </div>
  );
}

export default App;
