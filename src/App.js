import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
//import MenuDetails from './components/MenuDetails/MenuDetails';
import OrderPage from './components/OrderPage/OrderPage';
import MenuPage from './components/MenuPage/MenuPage';
import MyOrderPage from './components/MyOrdersPage/MyOrdersPage';
import './App.css';
import VendorQueues from './components/VendorPage/VendorQueues';

const Home = () => (
  <HomePage />
);

const Login = () => (
  <LoginPage />
);

const Order = () => (
  <OrderPage />
);

const VendorQueue = () => (
  <VendorQueues />
);

class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Login} />
          <Route path="/placeOrder" component={OrderPage} />
          <Route path="/menuPage" component={MenuPage} />
          <Route path="/myOrderPage" component={MyOrderPage} />
          <Route path="/vendorQueue" component={VendorQueues} />
        </div>
      </Router>
    );
  }
}

export default App;
