import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import LandingPage from './LandingPage';
import UploadPage from './components/UploadPage/UploadPage';
import NavigationBar from './components/NavigationBar';
import AllMapsPage from './components/AllMapsPage/AllMapsPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import MapPage from './components/MapPage/MapPage';
import TeamNavbar from './components/TeamNavbar/TeamNavbar';
import ScrimNavbar from './components/ScrimNavbar/ScrimNavbar';
import MapNavbar from './components/MapNavbar/MapNavbar';
import OAuthCallbackHandler from './components/OAuthCallbackHandler/OAuthCallbackHandler'



ReactDOM.render((<div className="wrapper">
  <Router>
      <Switch>
        {/* <Route path="/map/:id" component={MapPage}></Route> */}
        <Route path="/teams">
            <TeamNavbar></TeamNavbar>
        </Route>
        <Route path="/team/:teamid">
          <ScrimNavbar></ScrimNavbar>
        </Route>
        <Route path="/team/:teamid/scrim/:scrimid">
            <MapNavbar></MapNavbar>
        </Route>
        <Route path="/team/:teamid/scrim/:scrimid/map/:mapid">
            <NavigationBar></NavigationBar>
        </Route>
        <Route path="/upload">
          <UploadPage />
        </Route>
        <Route path="/callback"><OAuthCallbackHandler/></Route>
        <Route path="/">
            <LandingPage />
        </Route>
      </Switch>
    </Router>
</div>), document.getElementById('root'));
registerServiceWorker();
