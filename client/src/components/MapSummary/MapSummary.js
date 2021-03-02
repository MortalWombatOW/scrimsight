import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './MapSummary.css';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import Block from '../Block/Block';

const MapSummary = (props) => {
  if (props.id == null) {
    return <div></div>;
  }

  const [data, setData] = useState(null);

  if (data == null) {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/map/${props.id}/players`)
      .then(function (response) {
          setData(response.data.data);
      })
      .catch(function (error) {
          console.log('ERROR', error)
      });

      return <div>loading</div>
  }


  const columns = [{
    dataField: 'team',
    text: 'Team',
    sort: true
  },{
    dataField: 'player',
    text: 'Player',
  }, {
    dataField: 'damage',
    text: 'Damage Dealt',
    sort: true
  },{
    dataField: 'damage_taken',
    text: 'Damage Taken',
    sort: true
  },{
    dataField: 'healing',
    text: 'Healing',
    sort: true
  },{
    dataField: 'healing_recieved',
    text: 'Healing Recieved',
    sort: true
  },{
    dataField: 'kills',
    text: 'Kills',
    sort: true
  },{
    dataField: 'elims',
    text: 'Eliminations',
    sort: true
  },{
    dataField: 'deaths',
    text: 'Deaths',
    sort: true
  },{
    dataField: 'ults',
    text: 'Ults Used',
    sort: true
  }];

  return (
    <Block>

      <BootstrapTable keyField='player' data={ data.players } columns={ columns } />
    </Block>
  );

};

MapSummary.propTypes = {};

MapSummary.defaultProps = {};

export default MapSummary;
