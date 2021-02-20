import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import LandingPage from './LandingPage';
import UploadPage from './components/UploadPage/UploadPage';
import NavigationBar from './components/NavigationBar';
import AllMapsPage from './components/AllMapsPage/AllMapsPage';

// ReactDOM.render(<App />, document.getElementById('root'));
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import MapPage from './components/MapPage/MapPage';
ReactDOM.render((
<Router>
    <NavigationBar id={'navigation-bar'} brand={"scrimsight"} />
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
