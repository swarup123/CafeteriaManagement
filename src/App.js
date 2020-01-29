import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

import Login from './components/Login';
import Order from './components/Order';
import OrderReport from './components/OrderReport';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="menu">
            <ul>
              <li> <Link to="/">Login</Link> </li>
              <li> <Link to="/order">Order</Link> </li>
              <li> <Link to="/orderReport">Order Report</Link> </li>
            </ul>
        </div>
        <div className="App-intro">
          <Switch>
            <Route exact path="/"  component={Login} />
            <Route path="/order" component={Order} />
            <Route path="/orderReport" component={OrderReport} />
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
