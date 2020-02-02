import React, { Component } from 'react';
import EnhancedTable from './MenuTable';
import Button from '@material-ui/core/Button';

class MenuPage extends Component {
  render() {
    return (
      <div className="MenuPage">
        <EnhancedTable />        
      </div>
    );
  }
}

export default MenuPage;
