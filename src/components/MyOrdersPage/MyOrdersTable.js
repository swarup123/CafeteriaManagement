import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { Alert, AlertTitle } from '@material-ui/lab';
import './MyOrdersPage.css';
import LogoutMenu from '../OrderPage/OrderDropdown';
import { Info } from '@material-ui/icons';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: 'customerOrderId', disablePadding: true, label: 'id'},
  { id: 'orderTime', numeric: false, disablePadding: true, label: 'Ordered At' },
  { id: 'deliverTime', disablePadding: true, label: 'Excepted Delivery Time'},
  { id: 'total', numeric: true, disablePadding: true, label: 'Price' },
  { id: 'orderedState', disablePadding: true, label: 'Status' },
  { id: 'details', disablePadding: true, label: 'Details'},
  { id: 'action', disablePadding: true, label: 'Action'}
];



class EnhancedTableHead extends React.Component {

    constructor(props) {
        super(props);
    }
    

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = this.props;
        const createSortHandler = property => event => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                <TableCell
                    key={headCell.id}
                    align='left'
                    padding={headCell.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === headCell.id ? order : false}
                    hidden={headCell.hidden}
                >
                    <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                    >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                        <span className='order-table-visuallyHidden'>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                    ) : null}
                    </TableSortLabel>
                </TableCell>
                ))}
            </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'id',
      selected: [],
      page: 0,
      dense: true,
      rowsPerPage: 5,
      menuData: [],
      showalert: false,
      cancel: false
    };
    this.userId = localStorage.getItem('userId');
    this.menuId = '';
    this.estimatedTime = ''
  }
  cancelOrder(order) {  
    const payload = {
        "action": "CANCEL",
        "customerOrderId": order.customerOrderId,
        "deliverTime": order.deliverTime,
        "orderState": order.orderState,
        "orderTime": order.orderTime
      }
        
    fetch('http://localhost:8090/cafe/order/cancel', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(res => {
        let newTableData = this.state.menuData;
        let someData = newTableData.map((current) => {
          if(current.customerOrderId === order.customerOrderId )
            current['orderedState'] = res.orderState;
        });
        this.setState({showalert: true, order: 'asc',
        orderBy: 'id',
        selected: [],
        page: 0,
        cancel: true
        });
        setTimeout(() => {
          this.setState({showalert: false,cancel: false, menuData: someData})
        },3000)
    })
  }
  
  getDetails(menuItems) {
    if(menuItems.length ===0 ){
      return;
    }
    let itemStr = '';
    menuItems.map((item)=>{
      itemStr = `${itemStr} Name : ${item.itemName} , Price : ${item.price}  , Quantity : ${item.ordered}`;
    });
    return itemStr;
  }
  componentDidMount() {
    fetch(`http://localhost:8090/cafe/orders/customer/${this.userId}`)
    .then(res => res.json())
    .then(res => {    
      this.setState({ menuData: res });
      this.userId = res.userId;
      this.menuId = res.menuId
    })
  }

  handleRequestSort = (event, property) => {
    const isAsc = this.state.orderBy === property && this.state.order === 'asc';
    this.setState({
      order: isAsc ? 'desc' : 'asc',
      orderBy: 'price'
    });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = this.state.menuData.map(n => n.itemName);
      this.setState({ selected: newSelecteds});
      return;
    }
    this.setState({ selected: []});
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };
  
  render() {
    const isSelected = name => this.state.selected.indexOf(name) !== -1;

    const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.menuData.length - this.state.page * this.state.rowsPerPage);

    return (
      <div className='order-table-panel'>
        {this.state.showalert && !this.state.cancel && (<Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          {`Your order has been placed!!`}
        </Alert>)}
        {this.state.showalert && this.state.cancel && (<Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          {`Your order has been cancelled!!`}
        </Alert>)}
        <LogoutMenu />
        <Paper className='order-table-paper'>
          <TableContainer>
            <Table
              className='order-table'
              aria-labelledby="tableTitle"
              size={this.state.dense ? 'small' : 'medium'}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                numSelected={this.state.selected.length}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={this.state.menuData.length}
              />
              <TableBody>
                {stableSort(this.state.menuData, getSorting(this.state.order, this.state.orderBy))
                  .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
  
                    return (
                      <TableRow>
                        <TableCell component="th" id={labelId} scope="row" padding="none">{row.customerOrderId}</TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.orderTime}
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">{row.total}</TableCell>                       
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.orderState}
                      </TableCell>    
                      <TableCell component="th" id={labelId} scope="row" padding="none">     {this.getDetails(row.itemQuantities)}          
                      </TableCell>                    
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        <Button variant="contained" color="primary"     
                        className='place-order-button'
                          disabled={row.orderState === 'PLACED' ? false : true} 
                        onClick={() => this.cancelOrder(row)}
                        >
                        cancel
                        </Button>

                      </TableCell>
                    </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (this.state.dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={this.state.menuData.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
          />
        </Paper>        
      </div>
    );
  }
}
