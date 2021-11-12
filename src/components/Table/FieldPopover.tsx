// /* eslint-disable react/require-default-props */
// /* eslint-disable react/no-unused-prop-types */
// /* eslint-disable react/button-has-type */
// /* eslint-disable no-unused-vars */
// import React, {useCallback, useRef, useState} from 'react';
// import {Popover, Button} from '@mui/material';
// import {
//   summarizeTransform,
//   FieldDescription,
//   DatasetTransform,
//   filterTransform,
//   applyTransforms,
//   fieldTransforms,
//   sortTransform,
// } from '../../lib/data/data';
// import Dataset from '../services/Dataset';
// import DataRow from '../services/DataRow';

// interface FieldPopoverProps {
//   field: FieldDescription;
//   dataset: Dataset;
//   addTransform: (transform: DatasetTransform) => void;
//   close: () => void;
// }

// interface FieldPopoverChildProps {
//   field: FieldDescription;
//   dataset: Dataset;
//   addTransform: (transform: DatasetTransform) => void;
//   close: () => void;
//   closeInner: () => void;
// }

// interface RangeSelectorProps {
//   field: string;
//   data: number[];
//   addTransform: (transform: DatasetTransform) => void;
//   close: () => void;
//   closeInner: () => void;
// }

// const RangeSelector = (props: RangeSelectorProps) => {
//   const {data, addTransform, close, closeInner, field} = props;
//   const min = Math.min(...data);
//   const max = Math.max(...data);
//   console.log({
//     min,
//     max,
//   });
//   const width = 400;

//   // const xScale = (x: number) => ((x - min) / (max - min)) * width;
//   // const xScaleInverse = (x: number) => ((x / width) * (max - min)) + min;

//   const xPadding = 25;
//   const numTicks = 5;

//   const xScale = (x: number) =>
//     xPadding + ((x - min) / (max - min)) * (width - 2 * xPadding);
//   const xScaleInverse = (x: number) =>
//     ((x - xPadding) / (width - 2 * xPadding)) * (max - min) + min;

//   const [start, setStart] = useState(min);
//   const [end, setEnd] = useState(max);
//   const [startActive, setStartActive] = useState(false);
//   const [endActive, setEndActive] = useState(false);

//   return (
//     <div>
//       <svg
//         width={width}
//         height={50}
//         className="RangeSelector-root"
//         onMouseMove={(e) => {
//           if (startActive) {
//             const {movementX} = e;
//             const newStart = Math.max(
//               min,
//               Math.min(end, xScaleInverse(xScale(start) + movementX)),
//             );
//             setStart(newStart);
//           }
//           if (endActive) {
//             const {movementX} = e;
//             const newEnd = Math.max(
//               start,
//               Math.min(max, xScaleInverse(xScale(end) + movementX)),
//             );
//             setEnd(newEnd);
//           }
//         }}
//         onMouseUp={() => {
//           setStartActive(false);
//           setEndActive(false);
//         }}>
//         {/** ticks */}
//         {[...Array(numTicks).keys()].map((i) => {
//           const tickX =
//             (i * (width - 2 * xPadding)) / (numTicks - 1) + xPadding;
//           return (
//             <g key={i}>
//               <line
//                 x1={tickX}
//                 y1={20}
//                 x2={tickX}
//                 y2={30}
//                 strokeWidth={1}
//                 className="RangeSelector-axis"
//               />
//               <text
//                 x={tickX}
//                 y={45}
//                 textAnchor="middle"
//                 className="RangeSelector-axis"
//                 fontSize="12">
//                 {(i * (max - min)) / (numTicks - 1)}
//               </text>
//             </g>
//           );
//         })}

//         <line
//           x1={xScale(min)}
//           y1={25}
//           x2={xScale(max)}
//           y2={25}
//           className="RangeSelector-axis"
//         />
//         <line
//           x1={xScale(start)}
//           y1={25}
//           x2={xScale(end)}
//           y2={25}
//           className="RangeSelector-selected"
//         />
//         <text
//           x={xScale(start)}
//           y={15}
//           textAnchor="middle"
//           fontSize="14"
//           className="RangeSelector-label">
//           {start.toFixed(2)}
//         </text>
//         <text
//           x={xScale(end)}
//           y={15}
//           textAnchor="middle"
//           fontSize="14"
//           className="RangeSelector-label">
//           {end.toFixed(2)}
//         </text>
//         <circle
//           cx={xScale(start)}
//           cy={25}
//           r={5}
//           className="RangeSelector-edge"
//           onMouseDown={() => setStartActive(true)}
//         />
//         <circle
//           cx={xScale(end)}
//           cy={25}
//           r={5}
//           className="RangeSelector-edge"
//           onMouseDown={() => setEndActive(true)}
//         />
//       </svg>
//       <div className="RangeSelector-buttons">
//         <Button
//           onClick={() => {
//             closeInner();
//             close();
//             addTransform(
//               filterTransform(
//                 (row: DataRow) =>
//                   Number.parseFloat(row.get(field)!) >= start &&
//                   Number.parseFloat(row.get(field)!) <= end,
//                 `${field}`,
//                 `[${start}, ${end}]`,
//               ),
//             );
//           }}>
//           Apply
//         </Button>
//       </div>
//     </div>
//   );
// };

// const FilterPopover = (props: FieldPopoverChildProps) => {
//   const {field, dataset, addTransform, closeInner, close} = props;

//   const [selected, setSelected] = useState<string[]>([]);

//   if (field.type === 'string') {
//     const distinctValues: string[] = [...new Set(dataset.getField(field.name))];
//     return (
//       <div>
//         <div className="filterButtonGroup">
//           {distinctValues.map((value) => (
//             <Button
//               key={value}
//               onClick={() => {
//                 if (selected.includes(value)) {
//                   setSelected(selected.filter((v) => v !== value));
//                 } else {
//                   setSelected([...selected, value]);
//                 }
//               }}
//               className="filterButton"
//               variant={selected.includes(value) ? 'contained' : 'outlined'}>
//               {value}
//             </Button>
//           ))}
//         </div>

//         <Button
//           onClick={() => {
//             closeInner();
//             close();

//             if (selected.length === 1) {
//               addTransform({
//                 name: `Filter ${field.name} = ${selected[0]}`,
//                 transform: (d) =>
//                   filterTransform(
//                     (row: DataRow) => selected.includes(row.get(field.name)),
//                     field.name,
//                     selected.join(','),
//                   ).transform(d),
//               });
//               // if only one eventType is selected, transform fields to that eventType
//               if (
//                 field.name === 'eventType' &&
//                 fieldTransforms.get('raw_event')!.get(selected[0]) !== undefined
//               ) {
//                 addTransform({
//                   name: `Transform ${field.name} = ${selected[0]}`,
//                   transform: (d) =>
//                     applyTransforms(
//                       d,
//                       fieldTransforms.get('raw_event')!.get(selected[0])!,
//                     ),
//                 });
//               }
//             } else if (selected.length > 1) {
//               addTransform(
//                 filterTransform(
//                   (row: DataRow) => selected.includes(row.get(field.name)),
//                   field.name,
//                   selected.join(', '),
//                 ),
//               );
//             }
//           }}
//           className="filterButton"
//           variant="outlined">
//           Filter
//         </Button>
//       </div>
//     );
//   }

//   if (field.type === 'number') {
//     const data: number[] = dataset
//       .getField(field.name)!
//       .map((v) => parseFloat(v))
//       .filter((v) => !Number.isNaN(v));

//     return (
//       <RangeSelector
//         data={data}
//         addTransform={addTransform}
//         field={field.name}
//         close={close}
//         closeInner={closeInner}
//       />
//     );
//   }
//   return <div>filter</div>;
// };

// const SummarizePopover = (props: FieldPopoverChildProps) => {
//   const {field, dataset, addTransform, close, closeInner} = props;

//   const [aggType, setAggType] = useState<string>('sum');
//   const [groupByFields, setGroupByFields] = useState<string[]>([]);

//   return (
//     <div>
//       <div className="aggButtonGroup">
//         <Button
//           onClick={() => setAggType('sum')}
//           className="aggButton"
//           variant={aggType === 'sum' ? 'contained' : 'outlined'}>
//           Sum
//         </Button>
//         <Button
//           onClick={() => setAggType('cumsum')}
//           className="aggButton"
//           variant={aggType === 'cumsum' ? 'contained' : 'outlined'}>
//           Cumulative Sum
//         </Button>
//       </div>
//       <div className="groupByButtonGroup">
//         {dataset
//           .getFields()
//           .filter((f) => f.name !== field.name)
//           .map((f) => (
//             <Button
//               key={f.name}
//               onClick={() => {
//                 if (groupByFields.includes(f.name)) {
//                   setGroupByFields(groupByFields.filter((f2) => f2 !== f.name));
//                 } else {
//                   setGroupByFields([...groupByFields, f.name]);
//                 }
//               }}
//               className="groupByButton"
//               variant={
//                 groupByFields.includes(f.name) ? 'contained' : 'outlined'
//               }>
//               {f.name}
//             </Button>
//           ))}
//       </div>
//       <Button
//         onClick={() => {
//           closeInner();
//           close();
//           addTransform(summarizeTransform(groupByFields, aggType, field.name));
//         }}>
//         Summarize
//       </Button>
//     </div>
//   );
// };

// const SortPopover = (props: FieldPopoverChildProps) => {
//   const {field, addTransform, close, closeInner} = props;

//   return (
//     <div>
//       <Button
//         onClick={() => {
//           closeInner();
//           close();
//           addTransform(sortTransform(field.name, 'asc'));
//         }}>
//         Ascending
//       </Button>
//       <Button
//         onClick={() => {
//           closeInner();
//           close();
//           addTransform(sortTransform(field.name, 'desc'));
//         }}>
//         Descending
//       </Button>
//     </div>
//   );
// };

// const PopoverOptions = (props: FieldPopoverProps) => {
//   const {field, dataset, addTransform, close} = props;
//   const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
//   const closeInner = () => setAnchorEl(null);

//   const openOption = anchorEl?.dataset.optionid;
//   return (
//     <div className="FieldPopover-root">
//       <div className="FieldPopover-description">{field.description}</div>
//       <div className="popoveroptions">
//         <Button
//           onClick={(e) => setAnchorEl(e.currentTarget)}
//           data-optionid="filter"
//           variant={openOption === 'filter' ? 'contained' : 'outlined'}>
//           Filter
//         </Button>
//         <Button
//           onClick={(e) => setAnchorEl(e.currentTarget)}
//           data-optionid="summarize"
//           variant={openOption === 'summarize' ? 'contained' : 'outlined'}>
//           Summarize
//         </Button>
//         <Button
//           onClick={(e) => setAnchorEl(e.currentTarget)}
//           data-optionid="sort"
//           variant={openOption === 'sort' ? 'contained' : 'outlined'}>
//           Sort
//         </Button>
//       </div>
//       <Popover
//         open={Boolean(anchorEl)}
//         anchorEl={anchorEl}
//         onClose={() => setAnchorEl(null)}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'center',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'center',
//         }}>
//         {openOption === 'filter' && (
//           <FilterPopover
//             field={field}
//             dataset={dataset}
//             addTransform={addTransform}
//             close={close}
//             closeInner={closeInner}
//           />
//         )}
//         {openOption === 'summarize' && (
//           <SummarizePopover
//             field={field}
//             dataset={dataset}
//             addTransform={addTransform}
//             close={close}
//             closeInner={closeInner}
//           />
//         )}
//         {openOption === 'sort' && (
//           <SortPopover
//             field={field}
//             addTransform={addTransform}
//             close={close}
//             closeInner={closeInner}
//             dataset={dataset}
//           />
//         )}
//       </Popover>
//     </div>
//   );
// };

// const FieldPopover = (props: FieldPopoverProps) => {
//   const {field, dataset, addTransform} = props;
//   const {name, type, description} = field;

//   const headerRef = useRef<HTMLDivElement>(null);
//   const [open, setOpen] = useState(false);

//   return (
//     <th>
//       <div
//         className="fieldHeader"
//         ref={headerRef}
//         onClick={() => setOpen(true)}>
//         {name}
//       </div>
//       <Popover
//         open={open}
//         anchorEl={headerRef.current}
//         onClose={() => setOpen(false)}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'center',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'center',
//         }}>
//         <PopoverOptions
//           field={field}
//           dataset={dataset}
//           addTransform={addTransform}
//           close={() => setOpen(false)}
//         />
//       </Popover>
//     </th>
//   );
// };

// export default FieldPopover;
