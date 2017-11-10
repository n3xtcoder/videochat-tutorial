function getTwilio(e) {

    e.preventDefault();

    var that = this;

    fetch("user", {
    	method: "post",
        headers: new Headers({
    		"Content-Type": "application/json"
    	}),
    	body: JSON.stringify({
            username: document.getElementById('inputUsername').value,
            password: document.getElementById('inputPassword').value
    	})
    }).then(res=>res.json().then(
        function(data){
            sessionStorage.setItem("jwt", data.jwt);
            fetchToken();
        })
    );

    function fetchToken(){
        fetch("/token",{
            headers: new Headers({
                "authorization": "bearer " + sessionStorage.getItem("jwt")
            }),
        }).then(res=>res.json().then(function(data){
                var state={
                    loggedIn: true,
                    identity: data.identity,
                    token: data.token
                };
                that.setState(state);
                sessionStorage.setItem("loggedIn", state.loggedIn);
                sessionStorage.setItem("identity", state.identity);
                sessionStorage.setItem("token", state.token);
            }
        ))
    }
}

const Api = {
    getTwilio
};

export default Api;
