
function auth(){

    fetch("/user", {
      method: "POST",
      headers: new Headers({
        "content-Type":"appllication/json",
      }),
      body: JSON.stringify({
        username: this.state.user,
        password: this.state.password
      })
    })
      .then((res)=>res.json())
      .then((json)=>this.setState.token=json.token)
      .catch(error => console.error(error));
    }
    //.catch((err)=>{console.log(err)})


export default Api;
