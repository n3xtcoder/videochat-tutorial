function postForm() {
    fetch("user", {
    	method: "post",
        headers: new Headers({
    		"Content-Type": "application/json"
    	}),
    	body: JSON.stringify({
    		username: "doctor",
    		password: "password"
    	})
    }).then(res=>res.json().then( data => sessionStorage.setItem("jwt", data.jwt)));
}

function getToken() {
    fetch("/token",{
        headers: new Headers({
    		"authorization": "bearer " + sessionStorage.getItem("jwt")
    	}),
    }).then(res=>res.json().then(data=>console.log(data)))
}

const Api = {
    postForm,
    getToken

};
export default Api;
