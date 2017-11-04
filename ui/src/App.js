import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    render() {

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log(JSON.parse(this.response).jwt);
                sessionStorage.setItem('jwt', JSON.parse(this.response).jwt);
            }
        };
        xhr.open('POST', "/user");
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({username: "doctor", password: "password"}))

        function beforesend(request) {
            var jwt = "bearer " + sessionStorage.getItem("jwt");
            request.setRequestHeader('authorization', jwt)
        }
        var xhr2 = new XMLHttpRequest();
        xhr2.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.response);
            }
        };
        xhr2.open('GET', "/token");
        beforesend(xhr2);
        xhr2.send();

        return (<div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <h1 className="App-title">Welcome, this is React</h1>
            </header>
            <p className="App-intro">
                To get started, edit
                <code>src/App.js</code>
                and save to reload.
            </p>
        </div>);
    }
}

export default App;
