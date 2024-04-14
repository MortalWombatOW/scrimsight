import React from 'react';
import {useDataDisplayContext} from '../../context/DataDisplayContextProvider';
import {TemplatedString} from './common';
import {Typography} from '@mui/material';

interface DataHeaderProps {
  titleTemplate: string;
  subtitleTemplate: string;
}

const DataHeader: React.FC<DataHeaderProps> = ({
  titleTemplate,
  subtitleTemplate,
}) => {
  return (
    <div>
      <Typography variant="h2">
        <TemplatedString template={titleTemplate} />
      </Typography>
      {subtitleTemplate && (
        <Typography variant="h4" sx={{color: 'text.secondary', mt: 1}}>
          <TemplatedString template={subtitleTemplate} />
        </Typography>
      )}
    </div>
  );
};

export default DataHeader;
