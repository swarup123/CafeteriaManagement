import React, { Component } from 'react';
import EnhancedTable from './OrderTable';
import Button from '@material-ui/core/Button';

class OrderPage extends Component {
  render() {
    return (
      <div className="OrderPage">
        <h2>Today's menu</h2>
        <EnhancedTable />
        <Button variant="contained" color="primary" disabled={false}>
          Place Order
        </Button>
      </div>
    );
  }
}

export default OrderPage;
