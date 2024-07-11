import React, {useState} from 'react';
import {useDataNode} from '../../hooks/useData';
import {DataNodeName} from '../DataNode';
import {LinearProgress} from '@mui/material';
import {DataColumn, DataColumnType} from '../DataColumn';
import {useDataManager} from '../DataContext';
import {useDeepEffect} from '../../hooks/useDeepEffect';

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

const DataFetcher: React.FC<DataFetcherProps> = ({nodeName, renderContent}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dataResult, setDataResult] = useState<DataResult<object> | null>(null);

  const node = useDataNode(nodeName);

  const data = node?.getOutput() || [];
  const columns = node?.getColumns() || [];

  useDeepEffect(() => {
    setLoading(false);

    setDataResult({
      data,
      columns,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (node === undefined) {
    //punt if node is not found
    return null;
  }

  return (
    <>
      {loading && <LinearProgress />}
      {dataResult !== null && renderContent(dataResult)}
    </>
  );
};

export default DataFetcher;
