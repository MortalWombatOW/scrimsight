import React, {useState} from 'react';
import Header from 'components/Header/Header';
import MapInfo from 'components/MapInfo/MapInfo';
import {useParams, useSearchParams} from 'react-router-dom';
import './Map.scss';
import PlayByPlay from 'components/PlayByPlay/PlayByPlay';
import MetricExplorer from '../../components/MetricExplorer/MetricExplorer';
import ViewSelect from '../../components/ViewSelect/ViewSelect';
const Map = () => {
  const {mapId: mapIdStr} = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPlayerNamesStr = searchParams.get('players');
  const [view, setView] = useState('map');
  console.log('foo', selectedPlayerNamesStr);
  if (!mapIdStr) {
    return <div>No mapId</div>;
  }
  const mapId = Number.parseInt(mapIdStr, 10);
  let selectedPlayerNames: string[] = [];
  if (selectedPlayerNamesStr) {
    selectedPlayerNames = selectedPlayerNamesStr.split(',');
  }
  console.log(selectedPlayerNames);

  return (
    <div className="MapPage">
      <Header
        refreshCallback={undefined}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />

      <div className="container">
        <div className="section">
          {/* <div className="header">Map Info</div> */}
          <div className="content">
            <MapInfo
              mapId={mapId}
              selectedPlayerNames={selectedPlayerNames}
              setSelectedPlayerNames={(names: string[]) =>
                setSearchParams({players: names.join(',')})
              }
            />
          </div>
        </div>
        {/* <div className="section">
          <div className="header">Statistics</div>
          <div className="content">
            <MapTotals mapId={mapId} />
          </div>
        </div> */}
        <div className="sidebar">
          <ViewSelect currentView={view} setView={setView} />
        </div>
        {view === 'stats' && (
          <div className="section">
            {/* <div className="header">Statistics</div> */}
            <div className="content">
              <MetricExplorer mapId={mapId} />
            </div>
          </div>
        )}
        {view === 'play-by-play' && (
          <div className="section">
            {/* <div className="header">Play-by-play</div> */}
            <div className="content">
              <PlayByPlay mapId={mapId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
