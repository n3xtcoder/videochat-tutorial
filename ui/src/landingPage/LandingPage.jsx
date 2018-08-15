import React, { Component } from 'react';
import "./LandingPage.css";

// import auth from "./Api.js";

class LandingPage extends Component{
  constructor(props){
    super(props);
    this.state={
      user:this.props.user,
      password:this.props.password,
      // token:this.props.token,
      // loggedIn:this.props.loggedIn,
    }
        // this.auth = this.auth.bind(this);
  }


  auth() {
  fetch("/user", {
    method: "POST",
    headers: new Headers({
      "content-Type": "application/json"
    }),
    body: JSON.stringify({username: this.state.user, password: this.state.password})
  }).then((res) => res.json().then((res) => {
    localStorage.setItem("jwt", res.jwt);
    localStorage.setItem("user", this.state.user);
    localStorage.setItem("password", this.state.password);
    this.setState({loggedIn: true})
    localStorage.setItem("loggedIn", this.state.loggedIn);
    this.getToken();
    // console.log(res);
  })).catch(error => console.error(error));
}
//.catch((err)=>{console.log(err)})

  getToken() {
  fetch("/token", {
    method: "GET",
    headers: new Headers({
      "authorization": "Bearer " + localStorage.getItem("jwt")
    })
  }).then((res) => res.json().then((res) => {
    // console.log(res);
    localStorage.setItem("userIdentity", res.identity)
  }))
}




  render(){
    return (
      <div >

        <form className="form-control" onSubmit={(e)=>{e.preventDefault(); this.auth();this.props.updateState();}}>
          <input className="form-control" type="text" placeholder="Enter user name" onChange={(e)=>this.setState({user:e.target.value})}/>
          <input className="form-control" type="password" placeholder="Enter Password"  onChange={(e)=>this.setState({password:e.target.value})}/>
          <input className="form-control" type="submit"   defaultValue="Log in"/>
        </form>

      </div>
    )
  }

}
export default LandingPage;
