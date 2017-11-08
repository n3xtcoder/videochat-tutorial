import React, {Component} from 'react';
import Login from "./Login";
import Api from "./Api";
import Twilio from "./Twilio"





class App extends Component {
    getState= function(){
        return {
              loggedIn: sessionStorage.getItem("loggedIn"),
              identity: sessionStorage.getItem("identity"),
              token: sessionStorage.getItem("token")
          }
    }
    state = this.getState();

    login = Api.getTwilio.bind(this);

    logout = function(){
        sessionStorage.clear();
        this.setState(this.getState());
    }.bind(this)


    render() {
        return this.state.loggedIn ? <Twilio identity={this.state.identity} token={this.state.token} logout={this.logout}/> : <Login login={this.login}/>
    }
}

export default App;
