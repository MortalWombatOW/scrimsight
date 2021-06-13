import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AdminDashboard.css';
import Axios from 'axios';

const AdminDashboard = () => {
  const [teams, setTeams] = useState();

  useEffect(() => {

    let dostuff = async () => {
    if (teams == null) {
      const userid = localStorage.getItem('userid');
      if (userid) {
        const response = await Axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/memberships`);
        setTeams(response);
        return () => {};
      }
    }};

    dostuff();

    return () => {};
  });

  console.log(teams);
  return (
    <div className="AdminDashboard">
      {/* {teams.map(team => <span>{team}</span>)} */}
    </div>
  );
  };

AdminDashboard.propTypes = {};

AdminDashboard.defaultProps = {};

export default AdminDashboard;
