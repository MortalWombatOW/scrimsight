import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, {useMemo, useState} from 'react';
import Header from '../../components/Header/Header';
import MapsList from '../../components/MapsList/MapsList';
import useData from '../../hooks/useData';
import DataTable from 'react-data-table-component';
import sizeof from 'object-sizeof';
import {
  BaseData,
  FileUpload,
  OWMap,
  PlayerAbility,
  PlayerInteraction,
  PlayerStatus,
} from '../../lib/data/types';
import './SettingsPage.scss';
import {Treemap} from 'recharts';
import {uploadFile} from '../../lib/data/uploadfile';

const loadExampleData = async () => {
  [
    'https://scrimsight.com/assets/examples/Log-2021-02-25-22-04-31.txt',
    'https://scrimsight.com/assets/examples/Log-2021-02-25-22-21-17.txt',
    'https://scrimsight.com/assets/examples/Log-2021-02-25-22-42-04.txt',
    'https://scrimsight.com/assets/examples/Log-2021-02-25-23-02-15.txt',
    'https://scrimsight.com/assets/examples/Log-2021-02-25-23-33-09.txt',
    'https://scrimsight.com/assets/examples/Log-2021-02-25-23-52-16.txt',
  ].forEach(async (url) => {
    const fname = url.split('/').pop() || 'err name';
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
      type: 'image/jpeg',
    };
    let file = new File([data], fname, metadata);

    const fileUpload: FileUpload = {
      file,
      fileName: fname,
    };
    await uploadFile(fileUpload, (progress) => {
      console.log(fname, progress);
    });
  });
};

const SettingsPage = () => {
  const [updateCount, setUpdateCount] = React.useState(0);
  const incrementUpdateCount = () => setUpdateCount((prev) => prev + 1);

  const [selectedDataType, setSelectedDataType] = useState('Maps');

  const [maps, mapsUpdates] = useData<OWMap>('map');
  const [interactions, updates] =
    useData<PlayerInteraction>('player_interaction');
  const [statuses, statusUpdates] = useData<PlayerStatus>('player_status');
  const [abilities, abilityUpdates] = useData<PlayerAbility>('player_ability');

  const dataTypeOptions = [
    {value: maps, label: 'Maps'},
    {value: interactions, label: 'Interactions'},
    {value: statuses, label: 'Statuses'},
    {value: abilities, label: 'Abilities'},
  ];

  const currentTable = dataTypeOptions.find(
    (option) => option.label === selectedDataType,
  )?.value;

  const baseData: BaseData | undefined =
    maps && interactions && statuses && abilities
      ? {
          maps,
          interactions,
          statuses,
          abilities,
        }
      : undefined;

  return (
    <div>
      <Header
        refreshCallback={incrementUpdateCount}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <div className="Settings-container">
        <Typography variant="h4">Settings</Typography>
        <div>
          <Typography variant="h6">Usage</Typography>
          <Typography variant="body1">
            Dataset uses{' '}
            {baseData !== undefined &&
              (sizeof(baseData) / 1000000).toLocaleString()}{' '}
            MB of storage.
          </Typography>
        </div>
        <div>
          <Typography variant="h6">Inspect data</Typography>
          <FormControl
            sx={{
              margin: 2,
            }}>
            <InputLabel id="demo-simple-select-label">Data Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedDataType}
              label="Data Type"
              sx={{width: 200}}
              onChange={(event) => setSelectedDataType(event.target.value)}>
              {dataTypeOptions.map((option) => (
                <MenuItem key={option.label} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {currentTable && (
            <DataTable<OWMap | PlayerInteraction | PlayerStatus | PlayerAbility>
              columns={Object.keys(currentTable[0]).map((key) => ({
                name: key,
                selector: (row) =>
                  typeof row[key] === 'object' || Array.isArray(row[key])
                    ? JSON.stringify(row[key])
                    : row[key],
              }))}
              data={currentTable}
              pagination
              dense
              responsive
              progressPending={currentTable.length === 0}
            />
          )}
        </div>
        <div>
          <Typography variant="h6">Advanced</Typography>
          <Typography variant="body1">
            This section is for advanced users only. You probably don't need to
            use these features.
          </Typography>
          <Button variant="contained" onClick={loadExampleData}>
            Load example data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
