import {Typography, Button} from '@mui/material';
import React, {useState} from 'react';
import {
  Metric,
  MetricGroup,
  MetricValue,
  ReportComponent,
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
  const [values, setValues] = useState(component.metric.values);
  const [groups, setGroups] = useState(component.metric.groups);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const handleTypeChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setType(event.target.value as ReportComponentType);
  };

  const submit = () => {
    setComponent({
      type,
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
  const handleValuesChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setValues(event.target.value as MetricValue[]);
  };
  const handleGroupsChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setGroups(event.target.value as MetricGroup[]);
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
          <option value={ReportComponentType.chart}>Chart</option>
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
