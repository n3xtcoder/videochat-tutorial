import React, { Component } from 'react';
import TextField from "@material-ui/core"

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">

        <form className="form-control" onSubmit={(e)=>{e.preventDefault()}}>
          <input className="form-control" type="text" placeholder="Enter user name" />
          <input className="form-control" type="text" placeholder="Enter Password" />
          <input className="form-control" type="submit" />
        </form>

      </div>
    );
  }
}

export default App;
