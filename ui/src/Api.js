function postForm() {
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
