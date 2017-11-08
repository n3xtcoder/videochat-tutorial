import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Login from "./Login";
import Api from "./Api";
import Twilio from "./Twilio"





class App extends Component {
    state = {
          loggedIn: sessionStorage.getItem("loggedIn"),
          identity: sessionStorage.getItem("identity"),
          token: sessionStorage.getItem("token")
      };

    changeLoginState = Api.getTwilio.bind(this);


    render() {
        return this.state.loggedIn ? <Twilio identity={this.state.identity} token={this.state.token}/> : <Login login={this.changeLoginState}/>
    }
}

export default App;
