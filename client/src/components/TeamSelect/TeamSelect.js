import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TeamSelect.css';
import NavSelect from '../NavSelect/NavSelect';


const dropdown = (setTeam) => (() => (
  <span onClick={()=>setTeam('g9lul')}>teams</span>
));

const TeamSelect = (props) => {
  return (
    <NavSelect dropdown={dropdown(props.setTeam)}>{props.team == null ? 'Select Team' : props.team}</NavSelect>
  );
};

TeamSelect.propTypes = {};

TeamSelect.defaultProps = {};

export default TeamSelect;
