import React from 'react';
import PropTypes from 'prop-types';
import './Navbar.css';
import Select from 'react-select';
import { Col, Row, Container } from 'react-bootstrap';
import UserLink from '../UserLink/UserLink';
import TeamSelect from '../TeamSelect/TeamSelect';
import ScrimSelect from '../ScrimSelect/ScrimSelect';
import PlayerSelect from '../PlayerSelect/PlayerSelect';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import DateSelect from '../DateSelect/DateSelect';
import MapUpload from '../MapUpload/MapUpload';


const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const Navbar = () => {
  const [team, setTeam] = useQueryParam('team', StringParam);
  const [start, setStart] = useQueryParam('start', StringParam);
  const [end, setEnd] = useQueryParam('end', StringParam);
  return (
      <div className="Navbar">
          <TeamSelect team={team} setTeam={setTeam}/>
          <DateSelect start={start} setStart={setStart} end={end} setEnd={setEnd}></DateSelect>
      </div>
  );
};

Navbar.propTypes = {};

Navbar.defaultProps = {};

export default Navbar;
