import React, { useEffect } from 'react';
import {ReactDOM} from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import Header from '../../components/Header/Header';
import {Box} from '@mui/system';
import TableRenderers from 'react-pivottable/TableRenderers';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import Plot from 'react-plotly.js';
import useQueries from '~/hooks/useQueries';
import {logSpec} from '~/lib/data/logging/spec';
import { QueryBuilder } from '~/lib/data/explore';
import { DataRowBySpecName } from '~/lib/data/logging/spec';
import { Button, Select } from '@mui/material';
const PlotlyRenderers = createPlotlyRenderers(Plot);
const data = [
  ['Player Name', 'Eliminations', 'Deaths'],
  ['Player 1', 10, 5],
  ['Player 2', 5, 10],
  ['Player 3', 10, 10],
  ['Player 4', 5, 5],
  ['Player 5', 3, 5],
];

const buildQueryFromSpec = (dataType: string) => {
  const spec = logSpec;
  const query: QueryBuilder = {
    select: spec[dataType].fields.map((field) => {
      return {
        table: dataType,
        field: field.name,
      };
    }),
    from: dataType,
    orderBy: [],
  };
  return query;
};

const QueryResultToData = (result: DataRowBySpecName, spec: any, dataType: string) => {
  const data: any[] = [];
  const fields = spec[dataType].fields;
  const fieldNames = fields.map((field) => field.name);
  data.push(fieldNames);
  result[dataType].forEach((row) => {
    const rowData: any[] = [];
    fields.forEach((field) => {
      rowData.push(row[field.name]);
    });
    data.push(rowData);
  });
  return data;
};


const AnalysisPage = () => {
  const [state, setState] = React.useState({});
  const spec = logSpec;
  const [data, setData] = React.useState<any[]>([]);
  const [dataType, setDataType] = React.useState<string>('damage');

  console.log(buildQueryFromSpec(dataType));

  const result = useQueries(
    [
      {
        query: buildQueryFromSpec( dataType),
        name: 'analysis',
      },
    ],
    [dataType]
  );
  console.log('state', state);
  console.log('result', result);
  console.log('datatype', dataType);
  
  useEffect(() => {
  if (result[0]['analysis'] !== undefined) {
    const datarorbyspecname:DataRowBySpecName = {};
    datarorbyspecname[dataType] = result[0]['analysis'];
    const data2 = QueryResultToData(datarorbyspecname, spec, dataType);
    console.log('data', data2);
    setData(data2);
  }
}, [result[0]['analysis'] !== undefined,dataType]);
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
        sx={{display: 'flex', margin:'50px',flexWrap: 'wrap'}}>
          {Object.keys(spec).map((key) => {
            let niceName = key.replaceAll('_', ' ');
// cinvert to title case
            niceName = niceName.replace(/\w\S*/g, (txt) => {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

// uppercase the first character
            niceName = niceName.charAt(0).toUpperCase() + niceName.slice(1);

          
            return <Button variant="outlined"
            sx={{margin:'10px'}}
            onClick={() => setDataType(key)}>{niceName}</Button>;
          })}
      </Box>
          
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
