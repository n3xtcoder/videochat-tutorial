import React from 'react';
import logo from './logo.svg';

function Twilio (props) {
    return(
        <div>
            <div>Welcome {props.identity}</div>
            <p>your token: {props.token}</p>
        </div>
    )
}

export default Twilio;
