import React, {useEffect, useMemo, useState} from 'react';

import {Button} from '@mui/material';
import {
  OWMap,
  PlayerStatus,
  PlayerAbility,
  PlayerInteraction,
  Dataset,
  Transform,
  Extractor,
} from '../../lib/data/types';
import {extractDamage, makeAggregation} from '../../lib/data/data';

interface ReportBuilderProps {
  maps: OWMap[];
  status: PlayerStatus[];
  abilities: PlayerAbility[];
  interactions: PlayerInteraction[];
  dataCallback: (data: Dataset) => void;
  updateInd: number;
}

//

const ReportBuilder = (props: ReportBuilderProps) => {
  const {maps, status, abilities, interactions, dataCallback, updateInd} =
    props;
  // console.log(maps, status, abilities, interactions);

  const [extractor, setExtractor] = useState<Extractor>(() => extractDamage);
  const [transforms, setTransforms] = useState<Transform[]>([
    makeAggregation(['player', 'timestamp'], 'amount', 'sum', 'damage'),
  ]);

  useEffect(() => {
    const dataset = transforms.reduce(
      (data, transform) => transform(data),
      extractor(maps, status, abilities, interactions),
    );
    dataCallback(dataset);
  }, [updateInd]);

  // console.log(dataset);
  return (
    <div>
      <span>See</span>
    </div>
  );
};

export default ReportBuilder;
