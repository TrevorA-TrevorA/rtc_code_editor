import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" }
    this.update = this.update.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
  }
  
  update(e) {
    this.setState({ [e.target.type]: e.target.value });
  }

  async authenticateUser(e) {
    e.preventDefault();
    const params = { user: this.state };
    const options = {
      body: JSON.stringify(params),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }

    const response = await fetch("api/session", options)
    if (response.status === 400) { 
      console.log("log in failed")
      return;
    }

    const user = await response.json();
    window.currentUser = user;
    location.replace(`dash/${user.id}`)
  }
  
  render() {
    return (
      <form onSubmit={this.authenticateUser}>
        <label>email</label>
        <input type="email" onChange={this.update} value={this.state.email}/>
        <label>password</label>
        <input type="password" onChange={this.update} value={this.state.password}/>
        <input type="submit" value="sign in"/>
      </form>
    )
  }
}

export default Login;