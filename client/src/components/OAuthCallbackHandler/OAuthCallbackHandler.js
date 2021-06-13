import React, {useState, useEffect} from 'react';
import './OAuthCallbackHandler.css';
import DiscordOauth2 from 'discord-oauth2';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const OAuthCallbackHandler =  () => {
  const [redirect, setRedirect] = useState();

  const code = new URLSearchParams(window.location.search).get('code');
  const state = new URLSearchParams(window.location.search).get('state');

  useEffect(() => {
    const processCallback = async (code, state) => {

      console.log(code);
    
      const oauth = new DiscordOauth2({
        clientId: "815622008402477116",
        clientSecret: "S3w3_pmg1rkK3K9-huEso-oHx23ly_Yo",
        redirectUri: "http://localhost:3000/callback",
      });
    
      let data = `client_id=815622008402477116&client_secret=S3w3_pmg1rkK3K9-huEso-oHx23ly_Yo&grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/callback&scope=identify`;
      let headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      const e = await axios.post("https://discord.com/api/v8/oauth2/token", data, {
        headers: headers
      });

      // const e = await oauth.tokenRequest({
      //   code: code,
      //   scope: "identify",
      //   grantType: "authorization_code",
      // });
    
      console.log(e);
    
      headers = {
        'Authorization': "Bearer " + e.data.access_token,
        'Content-Type': "application/json",
      };
      const response = await axios.get("https://discord.com/api/v8/users/@me", { headers: headers } );
      
      const discordUser = response.data;
      // oauth.getUser(e.data.access_token);
    
      console.log(discordUser);
    
      localStorage.setItem('userid', discordUser.id);
      localStorage.setItem('avatar', 'https://cdn.discordapp.com/avatars/' + discordUser.id + '/' + discordUser.avatar + '.png');
      localStorage.setItem('username', discordUser.username + '# '+ discordUser.discriminator);
    
    
      let user = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/user/${discordUser.id}`).catch(e => null);
      console.log(user);

      if (!user){
        user = await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/user`, {id: discordUser.id});
        setRedirect('signup');
      } else {
        setRedirect('');
      }
    };
    
    if (redirect == null){
      processCallback(code, state);
    }
    return () => {};
  });

  if (redirect != null) {
    return <Redirect to={'/' + redirect}></Redirect>;
  }
  return <div>no</div>;
  };

OAuthCallbackHandler.propTypes = {};

OAuthCallbackHandler.defaultProps = {};

export default OAuthCallbackHandler;
