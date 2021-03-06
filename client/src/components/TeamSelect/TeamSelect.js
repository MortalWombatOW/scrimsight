import React from 'react';
import PropTypes from 'prop-types';
import './TeamSelect.css';
import Select from 'react-select';

const options = [
  { value: 'g9lul', label: 'Google G9Lul' },
]

const TeamSelect = () => (
  <div className="TeamSelect">
    <Select options={options} placeholder="Team" defaultInputValue="Google G9Lul"></Select>
  </div>
);

TeamSelect.propTypes = {};

TeamSelect.defaultProps = {};

export default TeamSelect;
