import React from "react";

function Login () {
    return (<form method="post">
        <div className="form-group col-6">
            <label for="inputUsername">
                Username
            </label>
            <input type="text" className="form-control" id="inputUsername" placeholder="Enter username" name="username"/>
        <div className="form-group col-6">
            <label for="inputPassword">
                Password
            </label>
            <input type="text" className="form-control" id="inputPassword" placeholder="Password" name="password"/>
        </div>
        </div>
    </form>)
}

export default Login;
