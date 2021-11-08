import React from 'react';
import { DatasetTransform } from '../../data';

interface DatasetTransformStackProps {
  transforms: Array<DatasetTransform>;
  setTransforms: (transforms: Array<DatasetTransform>) => void;
}

const DatasetTransformStack = (props: DatasetTransformStackProps) => {
  const { transforms, setTransforms } = props;

  const deleteTransformsAfter = (index: number) => {
    setTransforms(transforms.slice(0, index));
  };

  return (
    <div>
      {transforms.map((transform, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i}>
          {transform.name}
          <button
            type="button"
            onClick={() => {
              deleteTransformsAfter(i);
            }}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default DatasetTransformStack;
