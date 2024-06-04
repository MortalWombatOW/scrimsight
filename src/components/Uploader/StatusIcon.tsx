import React from 'react';
import {Box, CircularProgress} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const StatusIcon = ({percent}) => {
  const iconMapping = {
    success: <CheckIcon color="success" />,
    error: <CloseIcon color="error" />,
    indeterminate: <HourglassEmptyIcon color="primary" />,
  };

  let iconType = 'indeterminate';

  if (percent === 100) {
    iconType = 'success';
  } else if (percent < 0) {
    iconType = 'error';
  }

  return (
    <Box component="div" position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={percent < 0 ? 100 : percent}
        size={32}
        style={{
          padding: '4px',
        }}
        color={percent === 100 ? 'success' : percent < 0 ? 'error' : 'primary'}
      />
      <Box
        component="div"
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center">
        {iconMapping[iconType]}
      </Box>
    </Box>
  );
};

export default StatusIcon;
