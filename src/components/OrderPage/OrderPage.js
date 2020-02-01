import React, { Component } from 'react';
import EnhancedTable from './OrderTable';

class OrderPage extends Component {
  render() {
    return (
      <div className="OrderPage">
        <EnhancedTable />
      </div>
    );
  }
}

export default OrderPage;
