import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AllMapsPage.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Block from '../Block/Block';
import { Col, Row, Container, Card, Button, Badge, ListGroup} from 'react-bootstrap';
import MapSummary from '../MapSummary/MapSummary';
import MapLink from '../MapLink/MapLink';

const AllMapsPage = () => {
  const [data, setData] = useState(null);
  
  if (data == null) {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/logfile`)
    .then((res) => {             
      setData(res.data.data);
    })
    .catch((err) => {
      console.log(err);
    });
  
    return (
      <div className="AllMapsPage">
        dd
      </div>
    );
  }
  return (
    <Container>
			<Block title="Maps">
      <div className="AllMapsPage">
      <ListGroup>
      {data.map(id => <ListGroup.Item  key={id}><Link className="maplink" to={"/map/"+ id}><MapLink id={id}></MapLink></Link></ListGroup.Item>)}
    </ListGroup></div></Block>
		</Container>
   
  )
  ;
};

AllMapsPage.propTypes = {};

AllMapsPage.defaultProps = {};

export default AllMapsPage;
