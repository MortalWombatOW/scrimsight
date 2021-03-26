import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/main.css'
import { Jumbotron } from 'react-bootstrap'
import DemoPage from './components/DemoPage'
import axios from 'axios'

export default class Page extends Component {

  constructor() {
    super();
    this.state = {
      rsvpForm: {
        fullName: '',
        email: '',
        additionalInformation: '',
        guests: '',
        events: '',
        isRsvpSent: false
      },
      greetings: [],      
    };
  }

  
  handleChange(event) {    
    const obj = {};
    obj['rsvpForm'] = {...this.state.rsvpForm}
    obj['rsvpForm'][event.target.name] = event.target.value;
    this.setState(obj);
  };


  componentDidMount() {    
  }

  render() {
    return (
      

        <DemoPage id={'home'}/>
    )
  }
}
