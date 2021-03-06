import React from 'react';
import PropTypes from 'prop-types';
import './ScrimSelect.css';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
const ScrimSelect = () => (
  <div className="ScrimSelect">
    <Select options={options} placeholder="Scrim"></Select>
  </div>
);

ScrimSelect.propTypes = {};

ScrimSelect.defaultProps = {};

export default ScrimSelect;
