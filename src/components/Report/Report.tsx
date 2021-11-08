/* eslint-disable no-restricted-syntax */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
import { Button } from '@mui/material';
import React, { useMemo } from 'react';
import { applyTransforms, Dataset, DatasetTransform } from '../../data';
import DatasetTransformStack from '../DatasetTransformStack/DatasetTransformStack';
import DataTable from '../DataTable/DataTable';

interface ReportProps {
  dataset: Dataset,
}

const Report = (props: ReportProps) => {
  const { dataset } = props;
  const [transforms, setTransforms] = React.useState<DatasetTransform[]>([]);
  const addTransform = (transform: DatasetTransform) => setTransforms([...transforms, transform]);
  const setTransformsFromStack = (t: DatasetTransform[]) => setTransforms(t);
  const datasetTransformed : Dataset = useMemo(
    () => applyTransforms(dataset, transforms),
    [dataset, transforms],
  );

  return (
    <div>
      <div />
      <DatasetTransformStack transforms={transforms} setTransforms={setTransformsFromStack} />
      <DataTable dataset={datasetTransformed} addTransform={addTransform} />
      <Button onClick={() => setTransforms([])} variant="outlined">Reset</Button>
    </div>
  );
};

export default Report;
