import React, {useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import { Info, Cancel, CheckCircle } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import './vendor.css';
import LogoutMenu from '../OrderPage/OrderDropdown';

const useStyles = makeStyles(theme => ({
    table: {
      margin: 'auto'
    },
    point: {
        cursor: 'pointer'
    },
    popover: {
        pointerEvents: 'none',
      },
      paper: {
        padding: theme.spacing(1),
      }
  }));
let rowToBeCancelled = {};

  
const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

const CustomizedExpansionPanels = () => {
  const [expanded, setExpanded] = React.useState('panel1');
  const [popUpDetails, setDetails] = React.useState('');
  const [placedRows, setPlacedRows] = React.useState([]);  
  const [inProgressRows, setInProgressRows] = React.useState([]);
  const [packedOrderRows, setpackedOrderRows] = React.useState([]);
  const [pickUpRows, setpickUpRows] = React.useState([]);
  const [deliveredRows, setDeliveredRows] = React.useState([]);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEll, setAnchorEll] = React.useState(null);

  const handlePopoverOpen = (event, itemQuantities) => {
    setAnchorEl(event.currentTarget);
    let detailsString = '';
    itemQuantities.map(current => {
      detailsString = `${detailsString} Item Name: ${current.itemName} Quantity: ${current.ordered}`
      return current;
    });
    setDetails(detailsString);
    return;
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleOnClickAccept = (row) => {
    const payload = [
      {
        "action": "ACCEPT",
        "customerOrderId": row.customerOrderId,
        "deliverTime": row.deliverTime,
        "orderState": "PLACED",
        "orderTime": row.orderTime
      }
    ];
    fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(() => {
      fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=PLACED`)
      .then(res => res.json())
      .then(res => setPlacedRows(res))
  
      fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=GETTING_PREPARED`)
      .then(res => res.json())
      .then(res => {
        alert('your order has been moved to the next queue');
        setInProgressRows(res);
        setExpanded('panel2');
      })
    })
  }

  const handleReadyForDelivery = (row) => {
    const payload = [
      {
        "action": "PACK",
        "customerOrderId": row.customerOrderId,
        "deliverTime": row.deliverTime,
        "orderState": "GETTING_PREPARED",
        "orderTime": row.orderTime
      }
    ];
    fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(() => {
      fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=GETTING_PREPARED`)
      .then(res => res.json())
      .then(res => setInProgressRows(res))
  
      fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=PACKED`)
      .then(res => res.json())
      .then(res => {
        alert('your order has been moved to the next queue');
        setpackedOrderRows(res);
        setExpanded('panel3');
      })
    })
  }

  const handleNotifyCustomer = (row) => {
    const payload = [
      {
        "action": "NOTIFY",
        "customerOrderId": row.customerOrderId,
        "deliverTime": row.deliverTime,
        "orderState": "PACKED",
        "orderTime": row.orderTime
      }
    ];
    fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(() => {
      fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=PACKED`)
      .then(res => res.json())
      .then(res => setpackedOrderRows(res))
  
      fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=NOTIFIED_DELIVERY`)
      .then(res => res.json())
      .then(res => {
        alert('your order has been moved to the next queue');
        setpickUpRows(res);
        setExpanded('panel4');
      })
    })
  }

  const handleOrderDelivered = (row) => {
    const payload = [
      {
        "action": "DELIVER",
        "customerOrderId": row.customerOrderId,
        "deliverTime": row.deliverTime,
        "orderState": "NOTIFIED_DELIVERY",
        "orderTime": row.orderTime
      }
    ];
    fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(() => {
      fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=NOTIFIED_DELIVERY`)
      .then(res => res.json())
      .then(res => setpickUpRows(res))
  
      fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=DELIVERED`)
      .then(res => res.json())
      .then(res => {
        alert('your order has been moved to the next queue');
        setDeliveredRows(res)
        setExpanded('panel5');
      })
    })
  }

  const handleOnClickCancel = () => {
    let row = rowToBeCancelled;
    const payload = [
      {
        "action": "REJECT",
        "customerOrderId": row.customerOrderId,
        "deliverTime": row.deliverTime,
        "orderState": "PLACED",
        "orderTime": row.orderTime
      }
    ];
    fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(() => {
      handleClose();
      fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=PLACED`)
      .then(res => res.json())
      .then(res => {
        alert('This order has been rejected');
        setPlacedRows(res);
      })
    })
  }

  const openRejectpopup = (event, row) => {
    setAnchorEll(event.currentTarget); 
    rowToBeCancelled = row;
  }

  const handleClose = () => {
    setAnchorEll(null);
  };

  const open = Boolean(anchorEl);
  const open1 = Boolean(anchorEll);

  useEffect(() => {
    fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=PLACED`)
    .then(res => res.json())
    .then(res => setPlacedRows(res))

    fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=GETTING_PREPARED`)
    .then(res => res.json())
    .then(res => setInProgressRows(res))

    fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=PACKED`)
    .then(res => res.json())
    .then(res => setpackedOrderRows(res))

    fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=NOTIFIED_DELIVERY`)
    .then(res => res.json())
    .then(res => setpickUpRows(res))

    fetch(`http://10.16.34.17:8090/cafe/vendor/orders/${parseInt(localStorage.userId,10)}/{orderState}?orderState=DELIVERED`)
    .then(res => res.json())
    .then(res => setDeliveredRows(res))
  }, []);


  return (
    <div className="vendor-queue-page">
        <h3>Orders Received</h3>
        <LogoutMenu />
      <ExpansionPanel square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Orders placed</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <TableContainer className={classes.table} component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer Phone no.</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {placedRows.map(row => (
                        <TableRow key={row.customerOrderId}>
                        <TableCell component="th" scope="row">
                            {row.customerOrderId}
                        </TableCell>
                        <TableCell >{row.phone}</TableCell>
                        <TableCell >
                            <Info className={classes.point}
                                    onMouseEnter={(e) => handlePopoverOpen(e, row.itemQuantities)}
                                    onMouseLeave={handlePopoverClose}
                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"/>
                                
                            <Popover
                                id="mouse-over-popover"
                                className={classes.popover}
                                classes={{
                                paper: classes.paper,
                                }}
                                open={open}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                                onClose={handlePopoverClose}
                                disableRestoreFocus
                            >
                            
                                <Typography className={classes.typography}>{popUpDetails}</Typography>
                            </Popover>
                        </TableCell>
                        <TableCell>
                            <Cancel className={classes.point} onClick={(e) => openRejectpopup(e,row)}/>
                            <Popover
                              id='reject-pop-over'
                              open={open1}
                              anchorEl={anchorEll}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                              }}
                            > 
                              <div>
                                <TextField variant="outlined" label="Reason for rejection"/>
                                <div>
                                  <Button variant="contained" color="primary" 
                                    onClick={() => handleOnClickCancel(row)}
                                    className='place-order-button'>
                                    Reject Order
                                  </Button>
                                </div>
                              </div>
                            </Popover>
                            <CheckCircle onClick={() => handleOnClickAccept(row)} className={classes.point} />
                        </TableCell>
                        <TableCell hidden>
                            {row.deliverTime}
                        </TableCell>
                        <TableCell hidden>
                            {row.orderTime}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Orders in progress</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <TableContainer className={classes.table} component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer Phone no.</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {inProgressRows.map(row => (
                        <TableRow key={row.customerOrderId}>
                        <TableCell component="th" scope="row">
                            {row.customerOrderId}
                        </TableCell>
                        <TableCell >{row.phone}</TableCell>
                        <TableCell >
                            <CheckCircle onClick={() => handleReadyForDelivery(row)} />
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <ExpansionPanelSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Orders Ready</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <TableContainer className={classes.table} component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer Phone no.</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {packedOrderRows.map(row => (
                        <TableRow key={row.customerOrderId}>
                        <TableCell component="th" scope="row">
                            {row.customerOrderId}
                        </TableCell>
                        <TableCell >{row.phone}</TableCell>
                        <TableCell >
                            <CheckCircle onClick={() => handleNotifyCustomer(row)}/>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel square expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <ExpansionPanelSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography>Orders to be picked up</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <TableContainer className={classes.table} component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer Phone no.</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {pickUpRows.map(row => (
                        <TableRow key={row.customerOrderId}>
                        <TableCell component="th" scope="row">
                            {row.customerOrderId}
                        </TableCell>
                        <TableCell >{row.phone}</TableCell>
                        <TableCell >
                            <CheckCircle onClick={() => handleOrderDelivered(row)}/>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel square expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <ExpansionPanelSummary aria-controls="panel5d-content" id="panel5d-header">
          <Typography>Orders Delivered</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <TableContainer className={classes.table} component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer Phone no.</TableCell>
                        {/* <TableCell>Action</TableCell> */}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {deliveredRows.map(row => (
                        <TableRow key={row.customerOrderId}>
                        <TableCell component="th" scope="row">
                            {row.customerOrderId}
                        </TableCell>
                        <TableCell >{row.phone}</TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        
        </ExpansionPanelDetails>
      </ExpansionPanel>   
    </div>
  );
}

export default  CustomizedExpansionPanels;
