// /* eslint-disable no-restricted-syntax */
// /* eslint-disable react/button-has-type */
// /* eslint-disable react/no-array-index-key */
// import {Button} from '@mui/material';
// import React, {useMemo} from 'react';
// import {applyTransforms, DatasetTransform} from '../../lib/data/data';
// import Transforms from './Transforms';
// import DataTable from '../Table/DataTable';
// import DataPlot from '../Chart/DataPlot';

// interface ReportProps {
//   dataset: Dataframe;
// }

// const Report = (props: ReportProps) => {
//   const {dataset} = props;
//   const [transforms, setTransforms] = React.useState<Transform[]>([]);
//   const [view, setView] = React.useState<string>('table');

//   const addTransform = (transform: DatasetTransform) =>
//     setTransforms([...transforms, transform]);
//   const setTransformsFromStack = (t: DatasetTransform[]) => setTransforms(t);
//   const datasetTransformed: Dataset = useMemo(
//     () => applyTransforms(dataset, transforms),
//     [dataset, transforms],
//   );

//   return (
//     <div>
//       <Transforms
//         transforms={transforms}
//         setTransforms={setTransformsFromStack}
//       />
//       <div>
//         <Button onClick={() => setView('table')}>Table</Button>
//         <Button onClick={() => setView('plot')}>Plot</Button>
//       </div>
//       {view === 'table' && (
//         <DataTable dataset={datasetTransformed} addTransform={addTransform} />
//       )}
//       {view === 'plot' && (
//         <DataPlot dataset={datasetTransformed} width={800} height={700} />
//       )}
//     </div>
//   );
// };

// export default Report;
