import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Login from "./Login";
import Api from "./Api";
import Twilio from "./Twilio"





class App extends Component {

    render() {
        var loggedIn= true;
        return loggedIn ? <Twilio identity={sessionStorage.getItem("identity")} token={sessionStorage.getItem("token")}/> : <Login/>
    }
}

export default App;
