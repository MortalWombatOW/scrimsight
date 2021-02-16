import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './PlayersInMap.css';
import Block from '../Block/Block';
import axios from 'axios';
const PlayersInMap = (props) => {
  const [data, setData] = useState(null);

  if (data == null){
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/map/${props.id}/teams`, {
        // params :{
        //     dataType: 'json'
        // }
    })
        .then(function (response) {
            console.log('SUCCESS', response);
            console.log(response.data.data);
            setData(response.data.data);
        })
        .catch(function (error) {
            console.log('ERROR', error)
        });
      
        return <div>asdasdg</div>;
  }

  return (
  <div className="DamageChart">
    <Block title="Players">
      <ul>
       {Object.keys(data).map((player, i) => <li key={i}>{player}: {data[player]}</li>)}
      </ul>
    </Block>
  </div>
);
};

PlayersInMap.propTypes = {};

PlayersInMap.defaultProps = {};

export default PlayersInMap;
