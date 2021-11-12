import React from 'react';
import { Button } from '@mui/material';
import { DatasetTransform } from '../../lib/data/data';

interface TransformsProps {
  transforms: Array<DatasetTransform>;
  setTransforms: (transforms: Array<DatasetTransform>) => void;
}

const Transforms = (props: TransformsProps) => {
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
          <Button
            onClick={() => {
              deleteTransformsAfter(i);
            }}
            variant="outlined"
            style={{ width: '50px' }}
          >
            X
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Transforms;
