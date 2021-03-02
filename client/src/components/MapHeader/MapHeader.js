import React , {useState}from 'react';
import PropTypes from 'prop-types';
import './MapHeader.css';
import { Row, Col } from 'react-bootstrap';
import MapImg from '../MapImg/MapImg';
import axios from 'axios';

const MapHeader = (props) => {
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
     <Col md={2} style={{padding: 0}}><MapImg map={data.map_name} width={'200px'} height={'100px'}></MapImg></Col> 
     <Col md={3} className="team1">
       <div className="teamName">{data.teams[0].team}</div>
       <Row><Col md={5}>Kills: {data.teams[0].kills.toLocaleString()}</Col> <Col md={7}>Damage: {data.teams[0].damage.toLocaleString()}</Col></Row>
       <Row><Col md={5}>Ults: {data.teams[0].ults.toLocaleString()}</Col> <Col md={7}>Healing: {data.teams[0].healing.toLocaleString()}</Col></Row>
      </Col>
      <Col md={2} className="team1 wrap">
      <ul>
        {data.teams[0].player.map(name => <li className="player">{name}</li>)}
        </ul>
      </Col>
      <Col md={3} className="team2">
       <div className="teamName">{data.teams[1].team}</div>
       <Row><Col md={5}>Kills: {data.teams[1].kills.toLocaleString()}</Col> <Col md={7}>Damage: {data.teams[1].damage.toLocaleString()}</Col></Row>
       <Row><Col md={5}>Ults: {data.teams[1].ults.toLocaleString()}</Col> <Col md={7}>Healing: {data.teams[1].healing.toLocaleString()}</Col></Row>
      </Col>
      <Col md={2} className="team2 wrap">
        <ul>
        {data.teams[1].player.map(name => <li className="player">{name}</li>)}
        </ul>
      </Col>
      </Row>
  );

};

MapHeader.propTypes = {};

MapHeader.defaultProps = {};

export default MapHeader;
