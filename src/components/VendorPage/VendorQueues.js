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
import { Info, Cancel, CheckCircle } from '@material-ui/icons';

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
  
function createData(name, calories, data) {
    return { name, calories, data };
}
  
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
  const [deiverOrderRows, setDeliverOrderRows] = React.useState([]);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
    setDetails(event.currentTarget.parentNode.parentElement.lastChild.innerText);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleOnClickAccept = () =>{
    console.log('dsa');
  }

  const handleOnClickCancel = () =>{
    
  }

  const open = Boolean(anchorEl);

  useEffect(() => {
    fetch("http://localhost:8090/cafe/vendor/orders/1/{orderState}?orderState=PLACED")
    .then(res => res.json())
    .then(res => setPlacedRows(res[0].itemQuantities))

    fetch("http://localhost:8090/cafe/vendor/orders/1/{orderState}?orderState=GETTING_PREPARED")
    .then(res => res.json())
    .then(res => setInProgressRows([]))

    fetch("http://localhost:8090/cafe/vendor/orders/1/{orderState}?orderState=NOTIFIED_DELIVERY")
    .then(res => res.json())
    .then(res => setDeliverOrderRows([]))
  });


  return (
    <div>
        <h2>Orders Received</h2>
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
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {placedRows.map(row => (
                        <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                            {row.id}
                        </TableCell>
                        <TableCell >{row.itemName}</TableCell>
                        <TableCell >
                            <Info className={classes.point}
                                    onMouseEnter={(e) => handlePopoverOpen(e)}
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
                        <TableCell >
                            <Cancel className={classes.point} />
                            <CheckCircle onClick={handleOnClickAccept} className={classes.point} />
                        </TableCell>
                        <TableCell hidden>
                            {row.calories}
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
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {inProgressRows.map(row => (
                        <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell >{row.calories}</TableCell>
                        <TableCell >
                            <Info/>
                        </TableCell>
                        <TableCell >
                            <CheckCircle/>
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
          <Typography>Orders to be delivered</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <TableContainer className={classes.table} component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {deiverOrderRows.map(row => (
                        <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell >{row.calories}</TableCell>
                        <TableCell >
                            <Info/>
                        </TableCell>
                        <TableCell >
                            <Cancel/>
                            <CheckCircle/>
                        </TableCell>
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
