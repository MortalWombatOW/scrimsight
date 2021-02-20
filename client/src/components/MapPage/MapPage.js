import React from 'react';
import PropTypes from 'prop-types';
import './MapPage.css';
import DamageChart from '../DamageChart/DamageChart';
import PlayersInMap from '../PlayersInMap/PlayersInMap';
import MapPlayer from '../MapPlayer/MapPlayer';
import { Col, Row, Container, Card, Button, Badge} from 'react-bootstrap';

const players = [
  {hero: 'Ana', x: 4300, y:3000, team: 1},
  {hero: 'Zenyatta', x: 4400, y:3120, team: 1},
  {hero: 'Genji', x: 4100, y:3800, team: 1},
  {hero: 'Tracer', x: 4200, y:3600, team: 1},
  {hero: 'D.va', x: 4200, y:3100, team: 1},
  {hero: 'Winston', x: 3800, y:3800, team: 1},
  {hero: 'Moira', x: 3900, y:3500, team: 2},
  {hero: 'Lucio', x: 3900, y:3400, team: 2},
  {hero: 'Reaper', x: 3850, y:3300, team: 2},
  {hero: 'Mei', x: 3830, y:3500, team: 2},
  {hero: 'Zarya', x: 3900, y:3250, team: 2},
  {hero: 'Reinhardt', x: 3890, y:3200, team: 2},
 ];

const MapPage = (params) => (
  <div className="MapPage">
  <Container>
     <Row>
				<Col md={12}><MapPlayer players={players} /></Col>
			</Row>
			<Row>
				<Col md={4}><PlayersInMap key='players' id={params.match.params.id}></PlayersInMap></Col>
				<Col md={8}><DamageChart key='dmg' id={params.match.params.id}></DamageChart></Col>
			</Row>
		</Container>
    
        
  </div>
);

MapPage.propTypes = {};

MapPage.defaultProps = {};

export default MapPage;
