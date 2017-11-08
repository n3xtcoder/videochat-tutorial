import React from 'react';

function Twilio (props) {
    return(
        <div>
            <div>Welcome {props.identity}</div>
            <p>your token: {props.token}</p>
        </div>
    )
}

export default Twilio;
