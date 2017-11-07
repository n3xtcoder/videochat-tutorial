import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Login from "./Login";
import Api from "./Api";





class App extends Component {

    render() {
        Api.postForm();
        Api.getToken();

        return (
            <Login/>
        );
    }
}

export default App;
