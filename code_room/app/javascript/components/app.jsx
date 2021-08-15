import React from 'react';
import Home from './home'
import { store } from '../store'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Dash from './dash';

class App extends React.Component {
  render() {
    return (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <Home/>}/>
        <Route exact path="/dash" render={() => <Dash/>}/>
      </Switch>
    </BrowserRouter>
  </Provider>
    )}
}

export default App;