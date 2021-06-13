import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import LandingPage from './LandingPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import OAuthCallbackHandler from './components/OAuthCallbackHandler/OAuthCallbackHandler'
import DemoPage from './components/DemoPage';
import SignupFlow from './components/SignupFlow/SignupFlow';
import { QueryParamProvider } from 'use-query-params';
import Dashboard from './components/Dashboard/Dashboard';
import NavigationBar from './components/NavigationBar/NavigationBar'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import AllMapsPage from './components/AllMapsPage/AllMapsPage';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';

ReactDOM.render((<div className="wrapper">
  <Router>
  <NavigationBar />
  <QueryParamProvider ReactRouterRoute={Route}>
      <Switch>
        <Route path="/admin">
          <AdminDashboard></AdminDashboard>
        </Route>
      <Route path="/home">
          <AllMapsPage/>
      </Route>
        <Route path="/explore">
          <Dashboard>
            <span>a</span>
            <span>b</span>
            <span>c</span>
            <span>d</span>
          </Dashboard>
        </Route>
        <Route path="/callback"><OAuthCallbackHandler/></Route>
        <Route path="/signup">
            <SignupFlow />
        </Route>
        <Route path="/">
            <LandingPage />
        </Route>
      </Switch>
      </QueryParamProvider>
    </Router>
    </div>), document.getElementById('root'));
registerServiceWorker();
