function postForm() {
    fetch('/user', {
    	method: 'post',
        headers: new Headers({
    		'Content-Type': 'application/json'
    	}),
    	body: JSON.stringify({
    		username: "doctor",
    		password: "password"
    	})
    }).then(function(res){res.json().then( data => sessionStorage.setItem("jwt", data.jwt))});
}

function getToken() {
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
}

const Api = {
    postForm,
    getToken

};
export default Api;
