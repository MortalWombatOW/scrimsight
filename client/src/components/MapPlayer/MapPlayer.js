import React from 'react';
import PropTypes from 'prop-types';
import './MapPlayer.css';
import { MapInteractionCSS } from 'react-map-interaction';
import Block from '../Block/Block';
import mapimg from '../../img/topdown/kingsrow_anno.png';
import anaimg from '../../img/heroes/ana.png';
import asheimg from '../../img/heroes/ashe.png';
import bapimg from '../../img/heroes/baptiste.png';
import bastionimg from '../../img/heroes/bastion.png';
import brigimg from '../../img/heroes/brigitte.png';
import doomimg from '../../img/heroes/doomfist.png';
import dvaimg from '../../img/heroes/dva.png';
import echoimg from '../../img/heroes/echo.png';
import genjiimg from '../../img/heroes/genji.png';
import hanzoimg from '../../img/heroes/hanzo.png';
import junkimg from '../../img/heroes/junkrat.png';
import lucioimg from '../../img/heroes/lucio.png';
import mccreeimg from '../../img/heroes/mccree.png';
import meiimg from '../../img/heroes/mei.png';
import mercyimg from '../../img/heroes/mercy.png';
import moiraimg from '../../img/heroes/moira.png';
import orisaimg from '../../img/heroes/orisa.png';
import pharahimg from '../../img/heroes/pharah.png';
import reaperimg from '../../img/heroes/reaper.png';
import reinimg from '../../img/heroes/reinhardt.png';
import roadhogimg from '../../img/heroes/roadhog.png';
import sigmaimg from '../../img/heroes/sigma.png';
import soldierimg from '../../img/heroes/soldier76.png';
import sombraimg from '../../img/heroes/sombra.png';
import symimg from '../../img/heroes/symmetra.png';
import torbimg from '../../img/heroes/torbjorn.png';
import tracerimg from '../../img/heroes/tracer.png';
import widowimg from '../../img/heroes/widowmaker.png';
import winstonimg from '../../img/heroes/winston.png';
import ballimg from '../../img/heroes/wreckingball.png';
import zaryaimg from '../../img/heroes/zarya.png';
import zenimg from '../../img/heroes/zenyatta.png';





const hero_image = {
  'Ana': anaimg,
  'Ashe': asheimg,
  'Baptiste': bapimg,
  'Bastion': bastionimg,
  'Brigitte': brigimg,
  'Doomfist': doomimg,
  'D.va': dvaimg,
  'Echo': echoimg,
  'Genji': genjiimg,
  'Hanzo': hanzoimg,
  'Junkrat': junkimg,
  'Lucio': lucioimg,
  'McCree': mccreeimg,
  'Mei': meiimg,
  'Mercy': mercyimg,
  'Moira': moiraimg,
  'Orisa': orisaimg,
  'Pharah': pharahimg,
  'Reaper': reaperimg,
  'Reinhardt': reinimg,
  'Roadhog': roadhogimg,
  'Sigma': sigmaimg,
  'Soldier 76': soldierimg,
  'Sombra': sombraimg,
  'Symmetra': symimg,
  'Torbjorn': torbimg,
  'Tracer': tracerimg,
  'Widowmaker': widowimg,
  'Winston': winstonimg,
  'Wrecking Ball': ballimg,
  'Zarya': zaryaimg,
  'Zenyatta': zenimg
};


const MapPlayer = (
  props
) => (
  <div className="MapPlayer">
    <MapInteractionCSS defaultValue={{ scale: 0.5,
        translation: { x: -1400, y: -1450 }}} minScale={0.2} maxScale={1}> 
      <img src={mapimg} />
      {/* <img src={hero_image['ana']} className="hero-avatar"/> */}
      {/* {console.log(props.players)} */}
      {props.players.map((player, i) => <img key={i} src={hero_image[player.hero]} className="hero-avatar" style={{position: 'absolute', left:(player.x)+'px', top: player.y +"px", borderColor:player.team==1 ? '#1A8FE3' : '#D11149'}}/>)}
     </MapInteractionCSS>
  </div>
);

MapPlayer.propTypes = {};

MapPlayer.defaultProps = {};

export default MapPlayer;
