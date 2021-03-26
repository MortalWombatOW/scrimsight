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
import NavSelect from '../NavSelect/NavSelect';
import MapUpload from '../MapUpload/MapUpload';


const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const Navbar = () => {
  const [team, setTeam] = useQueryParam('team', StringParam);
  const [opponent, setOpponent] = useQueryParam('opponent', StringParam);
  const [date, setDate] = useQueryParam('date', StringParam);
  const [player, setPlayer] = useQueryParam('player', StringParam);
  return (
      <div className="Navbar">
          <TeamSelect team={team} setTeam={setTeam}/>
          {team != undefined ? <ScrimSelect/> : null}
          {team != undefined ? <PlayerSelect/> : null}
          <NavSelect dropdown={() => <MapUpload></MapUpload> }>Upload Map</NavSelect>
          <UserLink></UserLink>
      </div>
  );
};

Navbar.propTypes = {};

Navbar.defaultProps = {};

export default Navbar;
