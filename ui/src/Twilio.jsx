import React from 'react';

function Twilio (props) {
    return(
        <div className="col-6">
            <h1>Welcome {props.identity}</h1>
            <p>your token: {props.token}</p>
            <button type="submit" className="btn btn-outline-info" onClick={props.logout}>Logout</button>
        </div>
    )
}

export default Twilio;
