import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Redirect } from 'react-router-dom';


const options = [
  'MyOrders',
  'Logout'
];

const ITEM_HEIGHT = 48;

export default class LongMenu extends React.Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      navigate: false,
      open: false
    };
  }

  handleClick(event){
    this.setState({anchorEl: event.currentTarget,  open: true});
  };

  handleClose(){
    this.setState({open: false, navigate: true});
  };

render() {
  if(this.state.navigate){
    localStorage.clear();
    return <Redirect to="/" push={true}/>
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
        onClose={this.handleClose.bind(this)}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200,
          },
        }}
      >
        {options.map(option => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={this.handleClose.bind(this)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
}