import React from 'react';
import {PieChart, pieArcLabelClasses} from '@mui/x-charts/PieChart';

export const StatPieChart = ({data, label}: {data: any; label: string}) => {
  return (
    <PieChart
      series={[
        {
          data,
          arcLabel: (d) => `${Math.floor(d.value).toLocaleString()}`,
          innerRadius: 30,
          outerRadius: 60,
          paddingAngle: 2,
          cornerRadius: 5,
          startAngle: -120,
          endAngle: 120,
          cx: 100,
          cy: 100,
          valueFormatter: (d) => d.value.toLocaleString(),
          highlightScope: {
            faded: `global`,
            highlighted: `item`,
          },
          faded: {
            innerRadius: 30,
            additionalRadius: -5,
          },
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontWeight: 'bold',
          textShadow:
            '-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000',
        },
      }}
      slotProps={{legend: {hidden: true}}}
      height={200}
      width={200}>
      <text
        x={107}
        y={150}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 20,
          fill: 'white',
        }}>
        {label}
      </text>
    </PieChart>
  );
};
