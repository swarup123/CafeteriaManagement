import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Redirect } from 'react-router-dom';

const ITEM_HEIGHT = 40;

export default class LongMenu extends React.Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      navigate: false,
      open: false,
      orderNavigate: false,
      placedOrderNavigate: false,
      goBack: false,
      goBackRoute: false
    };
  }

  handleClick(event){
    this.setState({anchorEl: event.currentTarget,  open: true});
  };

  handleClose(){
    this.setState({open: false, navigate: true});
  };
  
  handleOutClose(){
    this.setState({open: false});
  };

  handleOrder(){
    this.setState({orderNavigate: true, goBack:true});
  }

  handlePlacedOrder(){
    this.setState({placedOrderNavigate: true});
  }

  handleGoRoute(){
    this.setState({goBackRoute: true});
  }


render() {
  if(this.state.navigate){
    localStorage.clear();
    return <Redirect to="/" push={true}/>
  }

  if(this.state.orderNavigate){
    localStorage.setItem('navigateValue',0);
    return <Redirect to="/myOrderPage" push={true}/>
  }

  if(this.state.placedOrderNavigate){
    return <Redirect to="/vendorQueue" push={true}/>
  }

  if(this.state.goBackRoute){
    localStorage.removeItem('navigateValue');
    return <Redirect to="/placeOrder" push={true}/>
  }
  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={this.handleClick.bind(this)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={this.state.anchorEl}
        keepMounted
        open={this.state.open}
        onClick={this.handleOutClose.bind(this)}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 169,
          },
        }}
      >
        <div >
          {/* <ul style={styles}> */}
            { localStorage.userType === 'CUSTOMER' && !localStorage.hasOwnProperty('navigateValue') &&
              <button  className='button-link' onClick={this.handleOrder.bind(this)}>My Orders</button>
            }
            { localStorage.userType === 'CUSTOMER' && parseInt(localStorage.navigateValue) === 0 &&
              <button  className='button-link' onClick={this.handleGoRoute.bind(this)}>Place Order</button>
            }
            { localStorage.userType === 'VENDOR' &&
              <button  className='button-link' onClick={this.handlePlacedOrder.bind(this)}>View Order</button>
            }
            <button className='button-link' onClick={this.handleClose.bind(this)}>Log out</button>
          {/* </ul> */}
        </div>
      </Menu>
    </div>
  );
}
}