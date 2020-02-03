import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
//import MenuDetails from './components/MenuDetails/MenuDetails';
import OrderPage from './components/OrderPage/OrderPage';
import MenuPage from './components/MenuPage/MenuPage';
import MyOrderPage from './components/MyOrdersPage/MyOrdersPage';
import './App.css';
import VendorQueues from './components/VendorPage/VendorQueues';
import BarChartReport from './components/ReportPage/BarChartReport';


const Login = () => (
  <LoginPage />
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
          <Route path="/chartReport" component={BarChartReport} />
        </div>
      </Router>
    );
  }
}

export default App;
