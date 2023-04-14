import {DamageIcon, TankIcon, SupportIcon} from '~/components/Common/RoleIcons';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {mapNameToFileName} from './../../lib/string';
import {DataRow} from 'lib/data/logging/spec';
import {Button, Typography} from '@mui/material';
interface MapRowProps {
  map: object;
  size: 'compact' | 'full';
  click: () => void;
}

const MapRow = (props: MapRowProps) => {
  const navigate = useNavigate();
  const {map, size, click} = props;
  console.log('size:', size);

  const timestampString = new Date(map['fileModified']).toLocaleString();
  // const {top, bottom} = getTeamInfoForMap(map);
  return (
    <div onClickCapture={() => click()} style={{display: 'flex', gap: '8px', borderBottom: '1px solid #ccc', padding: '8px', marginRight: 'auto'}}>

      <img
        src={mapNameToFileName(map['Map Name'], false)}
        alt={map['Map Name']}
        style={{
          height: '150px',
          width: '150px',
          objectFit: 'cover',
          borderRadius: '4px',
        }}
      />
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px'}}>
        <Typography variant="h4">{map['Map Name']}</Typography>
        <Typography variant="subtitle2">{map['Map Type']}</Typography>
        <Typography variant="subtitle2">{map['name']}</Typography>
        <Typography variant="subtitle2">{timestampString}</Typography>
        <Typography variant="body1">{map['Players'].join(', ')}</Typography>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Button
          variant="contained"
          onClick={() => navigate(`/review/${map['id']}`)}>
          View
        </Button>
      </div>
    </div>
  );
  // return (
  //   <button className="MapRow" onClick={() => navigate(`/review/${map.mapId}`)}>
  //     <div className="MapRow-image">
  //       <img src={imageSrc} alt={map.mapName} />
  //     </div>

  //     <div className="MapRow-teams-col">
  //       <div className="MapRow-teams-row">{top.name}</div>
  //       <div className="MapRow-teams-row">{bottom.name}</div>
  //     </div>
  //     <div className="MapRow-teams-col">
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player">
  //           <TankIcon />
  //           <span className="MapRow-playername">{top.tanks[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <TankIcon />
  //           <span className="MapRow-playername">{top.tanks[1]}</span>
  //         </div>
  //       </div>
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player MapRow-topmargin">
  //           <TankIcon />
  //           <span className="MapRow-playername">{bottom.tanks[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <TankIcon />
  //           <span className="MapRow-playername">{bottom.tanks[1]}</span>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="MapRow-teams-col">
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player">
  //           <DamageIcon />
  //           <span className="MapRow-playername">{top.dps[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <DamageIcon />
  //           <span className="MapRow-playername">{top.dps[1]}</span>
  //         </div>
  //       </div>
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player MapRow-topmargin">
  //           <DamageIcon />
  //           <span className="MapRow-playername">{bottom.dps[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <DamageIcon />
  //           <span className="MapRow-playername">{bottom.dps[1]}</span>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="MapRow-teams-col">
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player">
  //           <SupportIcon />
  //           <span className="MapRow-playername">{top.supports[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <SupportIcon />
  //           <span className="MapRow-playername">{top.supports[1]}</span>
  //         </div>
  //       </div>
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player MapRow-topmargin">
  //           <SupportIcon />
  //           <span className="MapRow-playername">{bottom.supports[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <SupportIcon />
  //           <span className="MapRow-playername">{bottom.supports[1]}</span>
  //         </div>
  //       </div>
  //     </div>
  //   </button>
  // );
};

export default MapRow;
