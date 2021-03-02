import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './MapLink.css';
import MapImg from '../MapImg/MapImg';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';

const MapLink = (props) => {
  if (props.id == null) {
    return <div></div>;
  }

  const [data, setData] = useState(null);

  if (data == null) {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/map/${props.id}/summary`)
      .then(function (response) {
          setData(response.data.data);
      })
      .catch(function (error) {
          console.log('ERROR', error)
      });

      return <div>loading</div>
  }
  console.log(data);
  return (
      <Row className="MapLink">
     <Col md={2} style={{padding: 0}}><MapImg map={data.map_name} width={'100px'} height={'50px'}></MapImg></Col> 
     <Col md={3} className="team1">
       <div className="teamName">{data.teams[0].team}</div>
       <Row><Col md={6}>Kills: {data.teams[0].kills}</Col> <Col md={6}>Deaths: {data.teams[0].deaths}</Col></Row>
       <Row><Col md={6}>Damage: {data.teams[0].damage}</Col> <Col md={6}>Healing: {data.teams[0].healing}</Col></Row>
      </Col>
      <Col md={2} className="team1 wrap">
      <ul>
        {data.teams[0].player.map(name => <li className="player">{name}</li>)}
        </ul>
      </Col>
      <Col md={3} className="team2">
       <div className="teamName">{data.teams[1].team}</div>
       <Row><Col md={6}>Kills: {data.teams[1].kills}</Col> <Col md={6}>Deaths: {data.teams[1].deaths}</Col></Row>
       <Row><Col md={6}>Damage: {data.teams[1].damage}</Col> <Col md={6}>Healing: {data.teams[1].healing}</Col></Row>
      </Col>
      <Col md={2} className="team2 wrap">
        <ul>
        {data.teams[1].player.map(name => <li className="player">{name}</li>)}
        </ul>
      </Col>
      </Row>
  );

};

MapLink.propTypes = {};

MapLink.defaultProps = {};

export default MapLink;
