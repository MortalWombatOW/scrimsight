// import {
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Typography,
// } from '@mui/material';
// import React from 'react';
// import DataTable from 'react-data-table-component';
// import {DataRow} from '~/lib/data/types';
// import Header from '../../components/Header/Header';
// import {FileUpload} from '../../lib/data/types';
// import {uploadFile} from '../../lib/data/uploadfile';
// import './SettingsPage.scss';

// const loadExampleData = async () => {
//   [
//     'https://scrimsight.com/assets/examples/Log-2021-02-25-22-04-31.txt',
//     'https://scrimsight.com/assets/examples/Log-2021-02-25-22-21-17.txt',
//     'https://scrimsight.com/assets/examples/Log-2021-02-25-22-42-04.txt',
//     'https://scrimsight.com/assets/examples/Log-2021-02-25-23-02-15.txt',
//     'https://scrimsight.com/assets/examples/Log-2021-02-25-23-33-09.txt',
//     'https://scrimsight.com/assets/examples/Log-2021-02-25-23-52-16.txt',
//   ].forEach(async (url) => {
//     const fname = url.split('/').pop() || 'err name';
//     let response = await fetch(url);
//     let data = await response.blob();
//     let metadata = {
//       type: 'image/jpeg',
//     };
//     let file = new File([data], fname, metadata);

//     const fileUpload: FileUpload = {
//       file,
//       fileName: fname,
//     };
//     await uploadFile(fileUpload, (progress) => {
//       console.log(fname, progress);
//     });
//   });
// };

// const SettingsPage = () => {
//   const [updateCount, setUpdateCount] = React.useState(0);
//   const incrementUpdateCount = () => setUpdateCount((prev) => prev + 1);
//   const [selectedDataType, setSelectedDataType] = React.useState('maps');

//   const dataTypeOptions = [
//     {value: maps, label: 'Maps'},
//     {value: player_interaction, label: 'Interactions'},
//     {value: player_status, label: 'Statuses'},
//     {value: player_ability, label: 'Abilities'},
//   ];

//   const currentTable = dataTypeOptions.find(
//     (option) => option.label === selectedDataType,
//   )?.value;

//   const clearAllData = () => {
//     // clear indexedDB
//     indexedDB.deleteDatabase('scrimsight');
//     // reload page
//     window.location.reload();
//   };

//   return (
//     <div>
//       <Header
//         refreshCallback={incrementUpdateCount}
//         filters={{}}
//         // eslint-disable-next-line @typescript-eslint/no-empty-function
//         setFilters={(filters) => {}}
//       />
//       <div className="Settings-container">
//         <Typography variant="h4">Settings</Typography>
//         <div>
//           <Typography variant="h6">Usage</Typography>
//           <Typography variant="body1">
//             Dataset uses{' '}
//             {/* {baseData !== undefined &&
//               (sizeof(baseData) / 1000000).toLocaleString()}{' '} */}
//             MB of storage.
//           </Typography>
//         </div>
//         <div>
//           <Typography variant="h6">Inspect data</Typography>
//           <FormControl
//             sx={{
//               margin: 2,
//             }}>
//             <InputLabel id="demo-simple-select-label">Data Type</InputLabel>
//             <Select
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//               value={selectedDataType}
//               label="Data Type"
//               sx={{width: 200}}
//               onChange={(event) => setSelectedDataType(event.target.value)}>
//               {dataTypeOptions.map((option) => (
//                 <MenuItem key={option.label} value={option.label}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           {currentTable && (
//             <DataTable<DataRow>
//               columns={
//                 currentTable.length > 0
//                   ? Object.keys(currentTable[0]).map((key) => ({
//                       name: key,
//                       selector: (row) =>
//                         typeof row[key] === 'object' || Array.isArray(row[key])
//                           ? JSON.stringify(row[key])
//                           : row[key],
//                     }))
//                   : []
//               }
//               data={currentTable}
//               pagination
//               dense
//               responsive
//               progressPending={currentTable.length === 0}
//             />
//           )}
//         </div>
//         <div>
//           <Typography variant="h6">Advanced</Typography>
//           <Typography variant="body1">
//             This section is for advanced users only. You probably don't need to
//             use these features.
//           </Typography>
//           <Button variant="contained" onClick={loadExampleData}>
//             Load example data
//           </Button>
//           <Button variant="contained" onClick={clearAllData}>
//             Clear all data
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;
