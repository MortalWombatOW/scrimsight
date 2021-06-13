import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AllMapsPage.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Block from '../Block/Block';
import { Col, Row, Container, Card, Button, Badge, ListGroup} from 'react-bootstrap';
import MapSummary from '../MapSummary/MapSummary';
import MapLink from '../MapLink/MapLink';
import Navbar from '../Navbar/Navbar';

const AllMapsPage = () => {
  const [data, setData] = useState(null);
  let maps = null;
  if (data == null) {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/memberships`)
    .then((res) => {             
      setData(res.data.data);
    })
    .catch((err) => {
      console.log(err);
    });
  
    maps = (
      <div className="loading">
      </div>
    );
  } else {
    maps = data.map((map, i) => <MapLink id={map.id} key={i} />)
  }
  return (
    <div className="AllMapsPage">
      <div className="filters">
        <Navbar/>
      </div>
      <div className="rightwrapper">
      <button className="uploadbutton draw meet">+</button>
      <div className="mapswrapper">
        {maps}
      </div>
      </div>
    </div>
   
  )
  ;
};

AllMapsPage.propTypes = {};

AllMapsPage.defaultProps = {};

export default AllMapsPage;
