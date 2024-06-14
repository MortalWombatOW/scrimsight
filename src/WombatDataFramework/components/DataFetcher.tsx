import React, {useEffect, useState} from 'react';
import {useDataNodeOutput} from '../../hooks/useData';
import {DataNodeName} from '../DataNode';
import {LinearProgress} from '@mui/material';
import {DataColumn, DataColumnType} from '../DataColumn';
import {useDataManager} from '../DataContext';

export interface DataResult<T> {
  data: T[];
  columns: DataColumn[];
  setFilter?: (key: string, value: DataColumnType) => void;
}

interface DataFetcherProps {
  nodeName: DataNodeName;
  filters?: object;
  renderContent: (dataResult: DataResult<object>) => React.ReactNode;
}

const DataFetcher: React.FC<DataFetcherProps> = ({nodeName, filters = {}, renderContent}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dataResult, setDataResult] = useState<DataResult<object> | null>(null);

  const dataManager = useDataManager();
  const data = useDataNodeOutput(nodeName, filters);

  useEffect(() => {
    setLoading(false);

    setDataResult({
      data,
      columns: data.length > 0 ? Object.keys(data[0]).map((columnName) => dataManager.getColumn(columnName)) : [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  return (
    <>
      {loading && <LinearProgress />}
      {dataResult !== null && renderContent(dataResult)}
    </>
  );
};

export default DataFetcher;
