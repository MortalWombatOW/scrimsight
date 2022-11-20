import React from 'react';
import Header from '../../components/Header/Header';
import MapsList from '../../components/MapsList/MapsList';

const UploadPage = () => {
  const [updateCount, setUpdateCount] = React.useState(0);
  const incrementUpdateCount = () => setUpdateCount((prev) => prev + 1);
  return (
    <div>
      <Header
        refreshCallback={incrementUpdateCount}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <div className="Home-container">
        <MapsList updateCount={updateCount} />
      </div>
    </div>
  );
};

export default UploadPage;
