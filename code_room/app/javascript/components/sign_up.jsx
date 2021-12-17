import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { LOGIN } from '../reducers/auth_reducer';

class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errorMessage: ""
     }

     this.update = this.update.bind(this);
     this.createUser = this.createUser.bind(this);
     this.validatePassword = this.validatePassword.bind(this);
  }

  validatePassword() {
    if (this.state.password.length < 8) {
      this.setState({errorMessage: "password must be at least 8 characters"});
      return false;
    }

    if (this.state.passwordConfirmation !== this.state.password) {
      this.setState({errorMessage: "passwords do not match"});
      return false;
    }
    return true;
  }

  update(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  async createUser(e) {
    e.preventDefault();
    if (!this.validatePassword()) return;
    const { username, email, password, passwordConfirmation } = this.state;
    const params = { user: { username, email, password } }
    params.user['password_confirmation'] = passwordConfirmation;

    const options = {
      body: JSON.stringify(params),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch("api/users", options)
      const user = await response.json();
      if (!response.ok) throw new Error(user.error)
      this.props.dispatch({ type: LOGIN, user: user})
      
    } catch(error) {
      console.log(error);
      this.setState({ errorMessage: error.message })
    }
  }

  render() {
    if (this.props.user) {
      return <Redirect to="/dash"/>
    }

    const errorText = this.state.errorMessage ? 
    <p className='auth-error-text'>{ this.state.errorMessage }</p> :
    null

    return (
      <div className="sign-up">
          <form onSubmit={this.createUser}>
            <label>username</label>
            <input id="username" onChange={this.update} type="text" autoFocus value={this.state.username}/>
            <label>email</label>
            <input id="email" onChange={this.update} type="email" onChange={this.update} value={this.state.email}/>
            <label>password</label>
            <input id="password" onChange={this.update} type="password" onChange={this.update} value={this.state.password}/>
            <label>confirm password</label>
            <input id="passwordConfirmation" onChange={this.update} type="password" onChange={this.update} value={this.state.passwordConfirmation}/>
            <div className='submit-row'>
              <input type="submit" value="create account"/>
              { errorText }
            </div>
          </form>
          <Link to="/log-in">sign in</Link>
        </div>
    )
  }
}

export default SignUp;