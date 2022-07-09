import {Grid} from '@mui/material';
import React from 'react';

const IconAndText = ({
  icon,
  text,
}: {
  icon: React.ReactElement;
  text: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
    {icon}
    <span style={{marginLeft: '0.5em'}}>{text}</span>
  </div>
);

export default IconAndText;
