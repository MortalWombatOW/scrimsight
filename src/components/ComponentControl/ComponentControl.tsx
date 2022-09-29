import {Typography, Button} from '@mui/material';
import React, {useState} from 'react';
import {
  Metric,
  MetricValue,
  ReportComponent,
  ReportComponentStyle,
  ReportComponentType,
} from '../../lib/data/types';
import MetricSelect from '../MetricExplorer/MetricSelect';
import './ComponentControl.scss';

interface ComponentControlProps {
  component: ReportComponent;
  setComponent: (component: ReportComponent | null) => void;
  size: number;
  setSize: (size: number) => void;
}

const ComponentControl: React.FC<ComponentControlProps> = ({
  component,
  setComponent,
  size,
  setSize,
}: ComponentControlProps) => {
  const [type, setType] = useState(component.type);
  const [style, setStyle] = useState(component.style);
  const [values, setValues] = useState(component.metric.values);
  const [groups, setGroups] = useState(component.metric.groups);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const handleTypeChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setType(event.target.value as ReportComponentType);
  };

  const submit = () => {
    setComponent({
      type,
      style,
      metric: {
        values,
        groups,
      },
    });
  };

  const remove = () => {
    setComponent(null);
  };

  const handleSizeChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setSize(event.target.value as number);
  };

  const handleStyleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setStyle(event.target.value as ReportComponentStyle);
  };

  return (
    <div>
      <div>
        <Typography variant="h6">Component Control</Typography>
      </div>
      <div>
        <Typography variant="body1">Type</Typography>
        <select value={type} onChange={handleTypeChange}>
          <option value={ReportComponentType.default}>Default</option>
          <option value={ReportComponentType.debug}>Debug</option>
          <option value={ReportComponentType.map}>Map</option>
          <option value={ReportComponentType.timeChart}>Time Chart</option>

          <option value={ReportComponentType.barChart}>Bar Chart</option>
        </select>
      </div>
      <div>
        <Typography variant="body1">Style</Typography>
        <select value={style} onChange={handleStyleChange}>
          <option value={ReportComponentStyle.default}>Default</option>
          <option value={ReportComponentStyle.topLine}>Top Line</option>
          <option value={ReportComponentStyle.emphasized}>Emphasized</option>
        </select>
      </div>
      <div ref={wrapperRef}>
        <MetricSelect
          metric={component.metric}
          onSelect={(metric) => {
            setValues(metric.values);
            setGroups(metric.groups);
          }}
          width={wrapperRef.current?.clientWidth ?? 300}
        />
      </div>
      <div>
        <Typography variant="body1">Size</Typography>
        <select value={size} onChange={handleSizeChange}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
        <div>
          <Button onClick={submit}>Update</Button>
          <Button onClick={remove}>Remove</Button>
        </div>
      </div>
    </div>
  );
};

export default ComponentControl;
