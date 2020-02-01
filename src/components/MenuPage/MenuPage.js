import React, { Component } from 'react';
import EnhancedTable from './MenuTable';
import Button from '@material-ui/core/Button';

class MenuPage extends Component {
  render() {
    return (
      <div className="MenuPage">
        <h2>Build today's menu</h2>
        <EnhancedTable />
        <Button variant="contained" color="primary" disabled={false}>
          Save Menu
        </Button>
      </div>
    );
  }
}

export default MenuPage;
