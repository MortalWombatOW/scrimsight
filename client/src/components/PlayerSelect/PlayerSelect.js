import React from 'react';
import PropTypes from 'prop-types';
import './PlayerSelect.css';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
const PlayerSelect = () => (
  <div className="PlayerSelect">
    <Select options={options} placeholder="Player"></Select>
  </div>
);

PlayerSelect.propTypes = {};

PlayerSelect.defaultProps = {};

export default PlayerSelect;
