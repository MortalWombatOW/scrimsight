import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './SignupFlow.css';
import Logo from '../Logo';
import axios from 'axios';

const createTeam = async (name, code) => {
  let user = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/team/${code}`).catch(e => null);
  if (!user){
    user = await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/team`, {name, code, user: localStorage.getItem('userid')});
    // setRedirect('signup');
    console.log('created')
    console.log(user);
    window.location.href='/explore';
  } else {
    // setRedirect('');
    console.log('That code is already in use by another team');
  }
};

const SignupFlow = () => {

  const [stage, setStage] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [code, setCode] = useState();

  const handleSubmit = event => {
    event.preventDefault();
    createTeam(teamName, code).then(() => console.log('done'))
  };


  let input = <div className="inputwrapper"><button key={1} onClick={() => setStage(1)}>Create a new team</button>
               <button key={2} onClick={() => setStage(2)}>Join existing team</button></div>;
  
  if(stage == 1) {
    input = <div className="inputwrapper"><form onSubmit = { handleSubmit }>
      <input type="text" key={1} placeholder="Team name" onChange={e => setTeamName(e.target.value)}/>
      <input type="text" key={2} placeholder="Enter 5-digit code" onChange={e => setCode(e.target.value)}/>
      <button type="submit">Go</button>
      </form></div>
  }

  if(stage == 2) {
    input = <div className="inputwrapper">
      <form onSubmit = { this.handleSubmit }><input type="text" key={1} placeholder="Enter team code" onChange={e => setCode(e.target.value)} /></form>
    </div>;
  }
            
  return  (
    <div className="SignupFlow">
        {input}
    </div>
  );
};

SignupFlow.propTypes = {};

SignupFlow.defaultProps = {};

export default SignupFlow;
