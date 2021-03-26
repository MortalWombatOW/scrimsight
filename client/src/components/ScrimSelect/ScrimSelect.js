import React from 'react';
import PropTypes from 'prop-types';
import './ScrimSelect.css';
import Select from 'react-select';
import NavSelect from '../NavSelect/NavSelect';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
const dropdown = () => (
  <span>scrims</span>
);

const ScrimSelect = () => (
  <NavSelect dropdown={dropdown}>Filter by opponent or date</NavSelect>
);

ScrimSelect.propTypes = {};

ScrimSelect.defaultProps = {};

export default ScrimSelect;
