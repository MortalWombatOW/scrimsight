/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Dataset } from '../../data';

interface ReportProps {
  dataset: Dataset,
}

const Report = (props: ReportProps) => {
  const { dataset } = props;

  return (
    <div>
      {dataset.slice(0, 10).rawData().map((row, i) => (
        <div key={`row ${i}`}>
          {row.map((cell, j) => (
            <div key={`row ${i} col ${j}`}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Report;
