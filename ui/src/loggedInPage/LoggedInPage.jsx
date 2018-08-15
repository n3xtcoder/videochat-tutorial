import React, { Component } from 'react';
import "./loggedinpage.css";

class LoggedInPage extends Component{
  constructor(props){
    super(props);
    this.state={
      user:this.props.user,
      loggedIn:this.props.loggedIn,
      userIdentity: localStorage.getItem('userIdentity')
    }
  }

  render(){
    return (
      <div className="container" >
        <form onSubmit={(e)=>e.preventDefault(),this.props.logOut}>

        <h1 >Welcome {"" + this.state.userIdentity} </h1>
        <input type="submit" defaultValue="logout" onSubmit={this.props.logOut}/>

      </form>
      </div>
    )
  }

}
export default LoggedInPage;
