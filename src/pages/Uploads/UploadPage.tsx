import React from 'react';
import Header from '../../components/Header/Header';
import MapsList from '../../components/MapsList/MapsList';
import Uploader from '../../components/Uploader/Uploader';
import useMetric from '../../hooks/useMetric';
import {MetricGroup, MetricValue} from '../../lib/data/types';
import DataTable from 'react-data-table-component';

const UploadPage = () => {
  const [updateCount, setUpdateCount] = React.useState(0);
  const incrementUpdateCount = () => setUpdateCount((prev) => prev + 1);

  const mapsInfo = useMetric({
    groups: [MetricGroup.map],
    values: [MetricValue.fileTime],
  });

  const columnDef = [
    {
      name: 'Map',
      selector: (row) => row.map,
      sortable: true,
    },
    {
      name: 'File Time',
      selector: (row) => row.fileTime,
      sortable: true,
    },
  ];
  return (
    <div>
      <Header
        refreshCallback={incrementUpdateCount}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <div className="Home-container">
        <Uploader refreshCallback={incrementUpdateCount} />
        <DataTable
          columns={columnDef}
          data={mapsInfo}
          pointerOnHover
          highlightOnHover
          progressPending={mapsInfo.length === 0}
        />
      </div>
    </div>
  );
};

export default UploadPage;
