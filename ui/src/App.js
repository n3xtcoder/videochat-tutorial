import React, {Component} from 'react';
import Login from "./Login";
import Api from "./Api";
import Twilio from "./Twilio"



const initialState = {
    loggedIn: sessionStorage.getItem("loggedIn"),
    identity: sessionStorage.getItem("identity"),
    token: sessionStorage.getItem("token")
}

class App extends Component {
    state = initialState;
    login = Api.getTwilio.bind(this);
    logout = function(){
        sessionStorage.clear();
        this.setState(initialState);
    }.bind(this)

    render() {
        return this.state.loggedIn ? <Twilio identity={this.state.identity} token={this.state.token} logout={this.logout}/> : <Login login={this.login}/>
    }
}

export default App;
