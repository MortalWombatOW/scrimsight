import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AllMapsPage.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Block from '../Block/Block';

const AllMapsPage = () => {
  const [data, setData] = useState(null);
  
  if (data == null) {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/logfile`)
    .then((res) => {             
      setData(res.data.data[0]);
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
    <Block title="Maps"><div className="AllMapsPage">
    {data.map(id => <Link className="maplink" key={id} to={"/map/"+ id}>Map {id}</Link>)}
    </div></Block>
  )
  ;
};

AllMapsPage.propTypes = {};

AllMapsPage.defaultProps = {};

export default AllMapsPage;
