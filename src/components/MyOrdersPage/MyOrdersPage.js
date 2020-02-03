import React, { Component } from 'react';
import EnhancedTable from './MyOrdersTable';

class MyOrdersPage extends Component {
  render() {
    return (
      <div className="MenuPage">
        <h3>My Orders</h3>
        <EnhancedTable />        
      </div>
    );
  }
}

export default MyOrdersPage;
