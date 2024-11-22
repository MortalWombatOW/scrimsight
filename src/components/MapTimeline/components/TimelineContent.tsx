// import React, { useEffect } from 'react';
// import { PixiWrapper } from './PixiWrapper';
// import { WindowHandle } from '../styles/timeline.styles';
// import { TimelineRowConfig } from '../types/row.types';
// import { renderTimelineRow } from '../utils/renderRow';

// const formatTime = (seconds: number): string => {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = Math.floor(seconds % 60);
//   return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
// };

// interface TimelineContentProps {
//   windowHandlers: {
//     handleMouseDown: (e: React.MouseEvent, type: 'start' | 'end') => void;
//     handleMouseUp: () => void;
//     handleMouseMove: (e: React.MouseEvent) => void;
//   };
//   defaultRowConfigs: TimelineRowConfig[];
// }

// export const TimelineContent: React.FC<TimelineContentProps> = ({
//   windowHandlers,
//   defaultRowConfigs,
// }) => {
//   const {
//     timelineData,
//     dimensions,
//     labelWidth,
//     setLabelWidth,
//     rowConfigs,
//     setRowConfigs,
//     handleDeleteRow,
//   } = useTimelineContext();

//   useEffect(() => {
//     console.log('TimelineContent dimensions:', {
//       width: dimensions.width,
//       labelWidth,
//       windowStartTime: dimensions.windowStartTime,
//       windowEndTime: dimensions.windowEndTime,
//     });
//   }, [dimensions, labelWidth]);

//   useEffect(() => {
//     setRowConfigs(defaultRowConfigs);
//   }, [defaultRowConfigs, setRowConfigs]);

//   const totalHeight = rowConfigs.reduce((sum, config) => sum + config.height, 0);

//   return (
//     <div
//       style={{ position: 'relative' }}
//       onMouseUp={windowHandlers.handleMouseUp}
//       onMouseMove={windowHandlers.handleMouseMove}
//       onMouseLeave={windowHandlers.handleMouseUp}
//     >
//       <PixiWrapper width={dimensions.width || 0} height={totalHeight}>
//         {rowConfigs.map((config, index) =>
//           renderTimelineRow({
//             config,
//             index,
//             configs: rowConfigs,
//             timelineData,
//             dimensions,
//             labelWidth,
//             setLabelWidth,
//             handleDeleteRow,
//           })
//         )}
//       </PixiWrapper>

//       <WindowHandle
//         style={{
//           left: `${dimensions.timeToX(dimensions.windowStartTime)}px`,
//           top: `${totalHeight - 40}px`
//         }}
//         onMouseDown={(e) => windowHandlers.handleMouseDown(e, 'start')}>
//         {formatTime(dimensions.windowStartTime)}
//       </WindowHandle>
//       <WindowHandle
//         style={{
//           left: `${dimensions.timeToX(dimensions.windowEndTime)}px`,
//           top: `${totalHeight - 40}px`
//         }}
//         onMouseDown={(e) => windowHandlers.handleMouseDown(e, 'end')}>
//         {formatTime(dimensions.windowEndTime)}
//       </WindowHandle>
//     </div>
//   );
// };
