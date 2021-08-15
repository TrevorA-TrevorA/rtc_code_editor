import React from 'react';
import HomeContainer from '../containers/home_container';
import { store } from '../store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import DashContainer from '../containers/dash_container';

class App extends React.Component {
  render() {
    const user = store.getState().user;
    return (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <HomeContainer/>}/>
        <Route exact path="/dash" render={() => <DashContainer/>}/>
      </Switch>
    </BrowserRouter>
  </Provider>
    )}
}

export default App;