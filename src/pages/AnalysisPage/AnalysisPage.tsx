import React, {useEffect} from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import Header from '../../components/Header/Header';
import {Box} from '@mui/system';
import TableRenderers from 'react-pivottable/TableRenderers';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import Plot from 'react-plotly.js';
import useQueries from '~/hooks/useQueries';
import {logSpec} from '~/lib/data/logging/spec';
import {QueryBuilder} from '~/lib/data/QueryBuilder';
import {DataRowBySpecName} from '~/lib/data/logging/spec';
import {Button} from '@mui/material';
const PlotlyRenderers = createPlotlyRenderers(Plot);

export const buildQueryFromSpec = (dataType: string, mapId?: number) => {
  const spec = logSpec;
  const query = new QueryBuilder()
    .select(
      spec[dataType].fields.map((field) => {
        return {
          table: dataType,
          field: field.name,
        };
      }),
    )
    .from({table: dataType});

  if (mapId !== undefined) {
    query.where([
      {
        field: {table: dataType, field: 'Map ID'},
        operator: '=',
        value: mapId,
      },
    ]);
  }

  query.orderBy([{value: {table: dataType, field: 'id'}, order: 'asc'}]);

  return query.build();
};

const QueryResultToData = (
  result: Record<string, object[]>,
  spec: any,
  dataType: string,
) => {
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

  const [{analysis}] = useQueries(
    [
      {
        query: buildQueryFromSpec(dataType),
        name: 'analysis',
      },
    ],
    [dataType],
  );
  console.log('state', state);
  console.log('result', analysis);
  console.log('datatype', dataType);

  useEffect(() => {
    if (analysis !== undefined) {
      const datarowbyspecname: Record<string, object[]> = {};
      datarowbyspecname[dataType] = analysis;
      const data2 = QueryResultToData(datarowbyspecname, spec, dataType);
      console.log('data', data2);
      setData(data2);
    }
  }, [analysis !== undefined, dataType]);
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
        sx={{display: 'flex', margin: '50px', flexWrap: 'wrap'}}>
        {Object.keys(spec).map((key) => {
          let niceName = key.replaceAll('_', ' ');
          // cinvert to title case
          niceName = niceName.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });

          // uppercase the first character
          niceName = niceName.charAt(0).toUpperCase() + niceName.slice(1);

          return (
            <Button
              variant="outlined"
              sx={{margin: '10px'}}
              onClick={() => setDataType(key)}>
              {niceName}
            </Button>
          );
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
