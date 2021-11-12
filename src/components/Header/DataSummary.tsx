// import React, {useState, useEffect} from 'react';
// import {applyTransforms, fieldTransforms} from '../../lib/data/data';
// import Dataset from '../services/Dataset';

// export interface DataSummaryProps {
//   dataset: Dataset;
// }

// const DataSummary = (props: DataSummaryProps) => {
//   const {dataset} = props;
//   const [maps, setMaps] = useState<string>('0');
//   const [events, setEvents] = useState<string>('0');

//   useEffect(() =>
//     setMaps(
//       applyTransforms(dataset, fieldTransforms.get('raw_event')!.get('map')!)
//         .selectDistinct('map')
//         .numRows()
//         .toLocaleString(),
//     ),
//   );
//   useEffect(() => setEvents(dataset.numRows().toLocaleString()));

//   const content = `Maps: ${maps}  Events: ${events}`;
//   return <div className="summary">{content}</div>;
// };

// export default DataSummary;
