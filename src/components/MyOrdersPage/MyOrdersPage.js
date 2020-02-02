import React, { Component } from 'react';
import EnhancedTable from './MyOrdersTable';

class MyOrdersPage extends Component {
  render() {
    return (
      <div className="MenuPage">
        <h2>My Orders</h2>
        <EnhancedTable />        
      </div>
    );
  }
}

export default MyOrdersPage;
