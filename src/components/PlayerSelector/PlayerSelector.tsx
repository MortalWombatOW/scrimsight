import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import React from 'react';
import {getAllPlayers} from '../../lib/data/data';
import {BaseData} from '../../lib/data/types';

const PlayerSelector = ({
  data,
  current,
  setCurrent,
}: {
  data: BaseData | undefined;
  current: string[];
  setCurrent: (players: string[]) => void;
}) => {
  console.log('PlayerSelector:', current);
  if (!data) {
    return null;
  }
  const allPlayers = getAllPlayers(data);
  return (
    <div>
      <FormGroup aria-label="position">
        {allPlayers.map((player) => (
          <FormControlLabel
            key={player}
            value={player}
            control={
              <Checkbox
                onChange={(event) => {
                  const newCurrent = current.includes(player)
                    ? current.filter((p) => p !== player)
                    : [...current, player];
                  setCurrent(newCurrent);
                }}
              />
            }
            label={player}
            labelPlacement="end"
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default PlayerSelector;
