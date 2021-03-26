import React from 'react';
import PropTypes from 'prop-types';
import './PlayerSelect.css';
import Select from 'react-select';
import NavSelect from '../NavSelect/NavSelect';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
const dropdown = () => (
  <span>players</span>
);

const PlayerSelect = () => (
  <NavSelect dropdown={dropdown}>Select a player</NavSelect>
);

PlayerSelect.propTypes = {};

PlayerSelect.defaultProps = {};

export default PlayerSelect;
