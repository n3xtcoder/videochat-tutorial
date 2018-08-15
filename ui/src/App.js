import React, { Component } from 'react';
import LandingPage from "./landingPage/LandingPage.jsx";
import LoggedInPage from "./loggedInPage/LoggedInPage.jsx";

import './App.css';


class App extends Component {
  constructor(){
    super();
    this.state={
      user:"",
      password:"",
      token:"",
      loggedIn:false,
    }
    this.updateState=this.updateState.bind(this);
    this.logOut=this.logOut.bind(this);
  }

  updateState(user,password,loggedIn){
    this.setState({
                   user: localStorage.getItem("user"),
                   password:  localStorage.getItem("password"),
                   loggedIn:  localStorage.getItem("loggedIn")});
  }

  logOut(){
    // console.log("logout");
    localStorage.clear();
    this.setState({user:"",
                  password:"",
                  token:"",
                  loggedIn:""})
  }

  componentWillMount(){

  }

  render() {
    let view = null;
    if(!this.state.loggedIn){
      view = <LandingPage   user={this.state.user}
                            password={this.state.password}
                            token={this.state.token}
                            loggedIn={this.state.loggedIn}
                            updateState={this.updateState}></LandingPage>
    }else{
      view = <LoggedInPage  user={this.state.user}
                            password={this.state.password}
                            token={this.state.token}
                            loggedIn={this.state.loggedIn}
                            updateState={this.updateState}
                            logOut={this.logOut}
                            >
                          </LoggedInPage>
    }

    return <div>
              {view}
          </div>
  }
}

export default App;
