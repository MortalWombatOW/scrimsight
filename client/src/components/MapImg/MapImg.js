import React from 'react';
import PropTypes from 'prop-types';
import './MapImg.css';
import blizz from '../../img/maps/blizzard-world.jpg';
import busan from '../../img/maps/busan.jpg';
import dorado from '../../img/maps/dorado.jpg';
import eichenwalde from '../../img/maps/eichenwalde.jpg';
import hanamura from '../../img/maps/hanamura.jpg';
import havana from '../../img/maps/havana.jpg';
import hollywood from '../../img/maps/hollywood.jpg';
import horizon from '../../img/maps/horizon-lunar-colony.jpg';
import ilios from '../../img/maps/ilios.jpg';
import junkertown from '../../img/maps/junkertown.jpg';
import kings from '../../img/maps/kings-row.jpg';
import lijiang from '../../img/maps/lijiang-tower.jpg';
import nepal from '../../img/maps/nepal.jpg';
import numbani from '../../img/maps/numbani.jpg';
import oasis from '../../img/maps/oasis.jpg';
import paris from '../../img/maps/paris.jpg';
import rialto from '../../img/maps/rialto.jpg';
import route from '../../img/maps/route-66.jpg';
import anubis from '../../img/maps/temple-of-anubis.jpg';
import volskaya from '../../img/maps/volskaya-industries.jpg';
import gibraltar from '../../img/maps/watchpoint-gibraltar.jpg';

const imgMap = {
  "Blizzard World": blizz,
  "Busan": busan,
  "Dorado": dorado,
  "Eichenwalde": eichenwalde,
  "Hanamura": hanamura,
  "Havana": havana,
  "Hollywood": hollywood,
  "Horizon Lunar Colony": horizon,
  "Ilios": ilios,
  "Junkertown": junkertown,
  "King's Row": kings,
  "Lijiang Tower": lijiang,
  "Nepal": nepal,
  "Numbani": numbani,
  "Oasis": oasis,
  "Paris": paris,
  "Rialto": rialto,
  "Route 66": route,
  "Temple of Anubis": anubis,
  "Volskaya Industries": volskaya,
  "Watchpoint Gibraltar": gibraltar
};

const MapImg = (props) => {
  console.log(props);
  return (
  <div className="MapImg">
    <img src={imgMap[props.map]} alt={props.map} style={{width: props.width || '300px', height: props.height || '150px'}}></img>
  </div>
);
};
MapImg.propTypes = {};

MapImg.defaultProps = {};

export default MapImg;
