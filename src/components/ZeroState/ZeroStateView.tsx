/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Dataset from '../services/Dataset';
import Uploader from '../Uploader/Uploader';

interface ZeroStateViewProps {
  addData: (dataset: Dataset) => void;
}

const ZeroStateView = (props: ZeroStateViewProps) => (
  <div className="zero-state-view">
    <Uploader
      addData={props.addData}
    />
  </div>
);

export default ZeroStateView;
