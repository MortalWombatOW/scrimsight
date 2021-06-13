import React, { Component, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/main.css'
import { Jumbotron } from 'react-bootstrap'
import DemoPage from './components/DemoPage'
import axios from 'axios'
import NavigationBar from './components/NavigationBar/NavigationBar';
import DiscordOauth2 from 'discord-oauth2';

import { GiGearHammer } from "react-icons/gi";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {RiListSettingsLine}from "react-icons/ri";

export default () => {
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

  return (
    <div className="LandingPage">
      <div className="text">MAKE PRACTICE PERFECT</div>
      <div className="subtext">Introducing the Overwatch scrim analysis platform for team managers and coaches, <span className="scrimsight">scrimsight</span></div>.
      <div className="cta">
        <button className="getstarted" onClick={() => {if (localStorage.getItem('userid') == null) { window.location = url;} else {window.location = "/home"}}}>GET STARTED</button>
        {/* <button className="examples" onClick={() => {window.location = 'explore';}}>EXAMPLES</button> */}
      </div>
      <div className="contentwrapper">
        <div  className="blockwrapper">
          <div className="block">
            <div className="blockicon"><RiListSettingsLine /></div>
            <div className="blocktext">Configure your Overwatch client to save workshop inspector logs to disk.</div>
          </div>
          <div className="block">
            <div className="blockicon"><GiGearHammer /></div>
            <div className="blocktext">Use workshop code <b>G3H7FF</b> as usual during your scrims.</div>
          </div>
          <div className="block">
            <div className="blockicon"><AiOutlineCloudUpload /></div>
            <div className="blocktext">Upload the logs to <b>scrimsight</b> and access your insights.</div>
          </div>
        </div>
        <div className="aboutme">
          Created by Andrew "MortalWombat" Gleeson - <a href="mailto:mortalwombat@scrimsight.com" className="contactlink">contact</a>
        </div>
      </div>
      <div className="footer">© 2021 Andrew Gleeson </div>
    </div>
  );
};