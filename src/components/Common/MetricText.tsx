import React, {useState} from 'react';
import {Button, Popover, Tooltip, Typography} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {getMetric, getTextForMetric} from '../../lib/data/metrics';

const MetricText = ({value, label}: {value: string; label: string}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  return (
    <div className="metric-text">
      <Tooltip title={getTextForMetric(label)}>
        <Typography variant="subtitle2" color="primary">
          {label}
        </Typography>
      </Tooltip>
      <Typography
        variant="h6"
        // className="hover-underline-animation"
        color="secondary"
        onClick={handleClick}>
        {value}
      </Typography>
      {/* {hasMetricFramework && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          <Typography variant="body2">{metricFramework.description}</Typography>
        </Popover>
      )} */}
    </div>
  );
};

export default MetricText;
