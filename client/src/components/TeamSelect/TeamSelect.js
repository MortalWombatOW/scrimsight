import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './TeamSelect.css';
import NavSelect from '../NavSelect/NavSelect';
import Axios from 'axios';


const dropdown = (setTeam) => (() => (
  <span onClick={()=>setTeam('g9lul')}>teams</span>
));

const TeamSelect = (props) => {

  const [teams, setTeams] = useState();

  useEffect(() => {
    let dostuff = async () => {
    if (teams == null) {
      const userid = localStorage.getItem('userid');
      console.log(userid);
      if (userid) {
        const response = await Axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/teams/${userid}`);
        setTeams(response.data);
      }
    }
  };

  dostuff();

  return () => {};
  })

  return (
    <button className="draw meet">Filter team {teams}</button>
  );
};

TeamSelect.propTypes = {};

TeamSelect.defaultProps = {};

export default TeamSelect;
