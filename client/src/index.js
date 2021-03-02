import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import LandingPage from './LandingPage';
import UploadPage from './components/UploadPage/UploadPage';
import NavigationBar from './components/NavigationBar';
import AllMapsPage from './components/AllMapsPage/AllMapsPage';
import DiscordOauth2 from 'discord-oauth2';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import MapPage from './components/MapPage/MapPage';

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
  scope: ["identify", "guilds"],
  state: state[0].toString(16), // Be aware that randomBytes is sync if no callback is provided
});

console.log(url);

// oauth.tokenRequest({


//   code: "fff",
//   scope: "identify",
//   grantType: "authorization_code",
  
  
// }).then(console.log);

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render((
<Router>
    <div className="wrapper">
    <Switch>
    <Route path="/map/:id" component={MapPage}></Route>
    <Route path="/map">
        <AllMapsPage />
    </Route>
    <Route path="/upload">
      <UploadPage />
    </Route>
    <Route path="/">
        <LandingPage />
    </Route>
  </Switch>
  </div>
  </Router>), document.getElementById('root'));
registerServiceWorker();
