import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import DashContainer from '../containers/dash_container';
import RoomContainer from '../containers/room_container';
import SignUpContainer from '../containers/sign_up_container';
import HomeContainer from '../containers/home_container';
import LoginContainer from '../containers/login_container';
import PasswordReset from './password_reset';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <HomeContainer/>}/>
        <Route exact path="/sign-up" render={() => <SignUpContainer/>}/>
        <Route exact path="/password-reset" render={() => <PasswordReset/>}/>
        <Route exact path="/log-in" render={() => <LoginContainer/>}/>
        <Route exact path="/dash" render={() => <DashContainer/>}/>
        <Route exact path="/doc/:docId" render={() => <RoomContainer/>}/>
      </Switch>
    </BrowserRouter>
  </Provider>
    )

export default App;