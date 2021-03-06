import React, {useState} from 'react';
import './OAuthCallbackHandler.css';
import DiscordOauth2 from 'discord-oauth2';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const OAuthCallbackHandler = () => {
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return <Redirect to='/teams'></Redirect>;
  }


  const code = new URLSearchParams(window.location.search).get('code');
  const state = new URLSearchParams(window.location.search).get('state');

  const oauth = new DiscordOauth2({
    clientId: "815622008402477116",
    clientSecret: "S3w3_pmg1rkK3K9-huEso-oHx23ly_Yo",
    redirectUri: "http://localhost:3000/callback",
  });

  oauth.tokenRequest({
      code: code,
      scope: "identify",
      grantType: "authorization_code",
    }).then(e => {
      console.log(e.access_token);
      return oauth.getUser(e.access_token);
    }).then(e => {

      console.log(e);
      localStorage.setItem('userid', e.id);
      localStorage.setItem('avatar', 'https://cdn.discordapp.com/avatars/' + e.id + '/' + e.avatar + '.png');
      localStorage.setItem('username', e.username+'#'+e.discriminator);
      setRedirect(true);
    });
    return null;
  };

OAuthCallbackHandler.propTypes = {};

OAuthCallbackHandler.defaultProps = {};

export default OAuthCallbackHandler;
