import React from 'react';
import HomeContainer from '../containers/home_container';
import { store } from '../store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import DashContainer from '../containers/dash_container';
import RoomContainer from '../containers/room_container';
import SignUpContainer from '../containers/sign_up_container';
window.store = store;

class App extends React.Component {
  render() {
    return (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <HomeContainer/>}/>
        <Route exact path="/sign-up" render={() => <SignUpContainer/>}/>
        <Route exact path="/dash" render={() => <DashContainer/>}/>
        <Route exact path="/doc/:docId/room" render={() => <RoomContainer/>}/>
      </Switch>
    </BrowserRouter>
  </Provider>
    )}
}

export default App;