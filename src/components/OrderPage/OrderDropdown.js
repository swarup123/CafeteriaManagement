import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
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
      goBackRoute: false,
      placedOrderValue: false,
      placedMenuValue: false,
      placeReport: false
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

  handleBackOrder(){
    this.setState({placedOrderValue: true});
  }

  handleMenuOrder(){
    this.setState({placedMenuValue: true});
  }

  handleReport(){
    this.setState({placeReport: true});
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
    localStorage.setItem('placeValue',0);
    return <Redirect to="/vendorQueue" push={true}/>
  }

  if(this.state.placedOrderValue){
    localStorage.removeItem('placeValue');
    return <Redirect to="/placeOrder" push={true}/>
  }

  if(this.state.goBackRoute){
    localStorage.removeItem('navigateValue');
    return <Redirect to="/placeOrder" push={true}/>
  }

  if(this.state.placedMenuValue){
    return <Redirect to="/menuPage" push={true}/>
  }

  if(this.state.placeReport){
    return <Redirect to="/chartReport" push={true}/>
  }
  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={this.handleClick.bind(this)}
        className='icon-button'
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
            { localStorage.userType === 'CUSTOMER' && parseInt(localStorage.navigateValue,10) === 0 &&
              <button  className='button-link' onClick={this.handleGoRoute.bind(this)}>Place Order</button>
            }
            { localStorage.userType === 'VENDOR' && !localStorage.hasOwnProperty('placeValue') &&
              <button  className='button-link' onClick={this.handlePlacedOrder.bind(this)}>View Order</button>
            }
            { localStorage.userType === 'VENDOR' && parseInt(localStorage.placeValue,10) === 0 &&
              <button  className='button-link' onClick={this.handleBackOrder.bind(this)}>Place Order</button>
            }
            { localStorage.userType === 'VENDOR' &&
              <button  className='button-link' onClick={this.handleMenuOrder.bind(this)}>View menu</button>
            }
            {localStorage.userType === 'VENDOR' &&              
              <button  className='button-link' onClick={this.handleReport.bind(this)}>View Report</button>
            }
            <button className='button-link' onClick={this.handleClose.bind(this)}>Log out</button>
          {/* </ul> */}
        </div>
      </Menu>
    </div>
  );
}
}