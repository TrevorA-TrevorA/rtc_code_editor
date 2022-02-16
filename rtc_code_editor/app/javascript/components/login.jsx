import React from 'react';
import { LOGIN } from '../reducers/auth_reducer';
import { Redirect, Link } from 'react-router-dom';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", errorMessage: "" }
    this.update = this.update.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
  }
  
  update(e) {
    this.setState({ [e.target.type]: e.target.value });
  }

  async authenticateUser(e) {
    e.preventDefault();
    const { email, password } = this.state;
    const params = { user: { email, password } };
    const options = {
      body: JSON.stringify(params),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch("api/session", options)
      if (!response.ok) throw new Error("log in failed")
      const user = await response.json();
      this.props.dispatch({ type: LOGIN, user: user})
    } catch(error) {
      console.log(error);
      this.setState({errorMessage: "Your username or password is invalid."})
    }
  }
  
  render() {
    if (this.props.user) {
      return <Redirect to="/dash"/>
    }

    const errorText = this.state.errorMessage ? 
    <p className='auth-error-text'>{this.state.errorMessage}</p> :
    null;

    return (
      <div className="login">
        <form onSubmit={this.authenticateUser}>
          <label>email</label>
          <input type="email" autoFocus onChange={this.update} value={this.state.email}/>
          <label>password</label>
          <input type="password" onChange={this.update} value={this.state.password}/>
          <div className="submit-row">
            <input type="submit" value="sign in"/>
            { errorText }
          </div>
          <Link className='pw-reset-link' to="/password-reset">forgot password?</Link>
        </form>
        <Link className='nav-link' to="/sign-up">create account</Link>
      </div>
    )
  }
}

export default Login;