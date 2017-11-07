function getTwilio(e) {

    e.preventDefault();

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
                console.log(data);;
                sessionStorage.setItem("identity",data.identity);
                sessionStorage.setItem("token",data.token);
            }
        ))
    }

}

const Api = {
    getTwilio
};

export default Api;
