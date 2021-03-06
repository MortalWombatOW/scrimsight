import React from 'react';
import PropTypes from 'prop-types';
import './MapSelect.css';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
const MapSelect = () => (
  <div className="MapSelect">
    <Select options={options} placeholder="Map"></Select>
  </div>
);

MapSelect.propTypes = {};

MapSelect.defaultProps = {};

export default MapSelect;
