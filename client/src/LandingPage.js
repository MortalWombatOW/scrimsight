import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/main.css'
import { Jumbotron } from 'react-bootstrap'
import DemoPage from './components/DemoPage'
import Location from './components/Location'
import NavigationBar from './components/NavigationBar'
import Ceremony from './components/Ceremony'
import RSVP from './components/RSVP'
import axios from 'axios'
import Greetings from './components/Greetings'

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
    this.handleRsvp = this.handleRsvp.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  
  handleChange(event) {    
    const obj = {};
    obj['rsvpForm'] = {...this.state.rsvpForm}
    obj['rsvpForm'][event.target.name] = event.target.value;
    this.setState(obj);
  };

  handleRsvp = (event) => {
    event.preventDefault();
    const data = {...this.state.rsvpForm}      
    
    // axios.post(`rsvp`, data)
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/rsvp`, data)    
      .then((res) => {             
        this.setState({rsvpForm: {fullName: '', email: '', additionalInformation: '', greeting: '', guests: '', events: '', isRsvpSent: true}});
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getGreetings = () => {    
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/greetings`)
    // axios.get(`greetings`)     
    .then((res) => {              
     this.setState({greetings: res.data.data.greetings});
    })
    .catch((err) => {
      console.log(err);
    });
  }

  componentDidMount() {    
    this.getGreetings();
  }

  render() {
    return (
      

        <DemoPage id={'home'}/>
    )
  }
}
