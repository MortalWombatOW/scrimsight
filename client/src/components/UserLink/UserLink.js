import React from 'react';
import PropTypes from 'prop-types';
import './UserLink.css';
import DiscordOauth2 from 'discord-oauth2';
import discord from '../../img/discord_icon.png';
import user from '../../img/user.png';

const UserLink = (props) => {

  const userid = localStorage.getItem('userid');
  const username = localStorage.getItem('username');
  const avatarUrl = localStorage.getItem('avatar');

  if (userid == null) {
    const oauth = new DiscordOauth2({
      clientId: "815622008402477116",
      clientSecret: "S3w3_pmg1rkK3K9-huEso-oHx23ly_Yo",
      redirectUri: "http://localhost:3000/callback",
    });
    
    const state = new Uint16Array(1);
    window.crypto.getRandomValues(state);
    console.log(state);
    console.log(state[0].toString(16));
    const url = oauth.generateAuthUrl({
      scope: ["identify"],
      state: state[0].toString(16), // Be aware that randomBytes is sync if no callback is provided
    });
    
    const content = props.children ? props.children : "Log in with Discord";
    return (
      <a className="UserLink" href={url}>
        <img src={discord} width={46} height={46}></img>
        <span className="name" >{content}</span>
      </a>
    );
  }

  return (<a className="UserLink loggedin" href={'/teams'}>
    <img src={avatarUrl} width={46} height={46}></img>
    {props.children ? props.children : username}
  </a>);
};
UserLink.propTypes = {};

UserLink.defaultProps = {};

export default UserLink;
