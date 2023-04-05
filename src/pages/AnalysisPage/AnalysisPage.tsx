import React from 'react';
import {ReactDOM} from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import Header from '../../components/Header/Header';
import {Box} from '@mui/system';
import TableRenderers from 'react-pivottable/TableRenderers';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import Plot from 'react-plotly.js';
const PlotlyRenderers = createPlotlyRenderers(Plot);
const data = [
  ['Player Name', 'Eliminations', 'Deaths'],
  ['Player 1', 10, 5],
  ['Player 2', 5, 10],
  ['Player 3', 10, 10],
  ['Player 4', 5, 5],
  ['Player 5', 3, 5],
];

const AnalysisPage = () => {
  const [state, setState] = React.useState({});

  console.log('state', state);
  return (
    <div>
      <Header
        refreshCallback={undefined}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <Box
        component="div"
        sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <PivotTableUI
          data={data}
          onChange={(s) => setState(s)}
          {...state}
          renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
        />
      </Box>
    </div>
  );
};

export default AnalysisPage;
