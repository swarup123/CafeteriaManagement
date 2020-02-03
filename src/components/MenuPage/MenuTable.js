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
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
import './MenuPage.css';
import LogoutMenu from '../OrderPage/OrderDropdown';

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
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'price', numeric: true, disablePadding: true, label: 'Price' },
  { id: 'availableQuantity', disablePadding: true, label: 'Quantity' },
  { id: 'maxQuantity', disablePadding: true, label: 'MaxQuantity' },
  { id: 'id', disablePadding: true, label: 'id', hidden:true}
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
                <TableCell padding="checkbox">
                <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{ 'aria-label': 'select all desserts' }}
                />
                </TableCell>
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
      showalert: false
    };
    this.userId = parseInt(localStorage.getItem('userId'));
    this.estimatedTime = ''
  }

  componentDidMount() {
    fetch(`http://10.16.34.17:8090/cafe/dm/${this.userId}`)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      this.setState({ menuData: res.items });
      this.userId = res.vendorId;
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
      const newSelecteds = this.state.menuData.map(n => n.name);
      this.setState({ selected: newSelecteds});
      return;
    }
    this.setState({ selected: []});
  };

  handleClick = (event, row) => {
    const selectedIndex = this.state.selected.indexOf(row.name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(this.state.selected, row.name);
    } else {
      let newTableData = this.state.menuData;
      newTableData.map((current,index) => {
        if(current.id === row.id) {
          newTableData[index]['ordered'] = 0
        }
      });
      
      this.setState({menuData: newTableData});       
      if (selectedIndex === 0) {
        newSelected = newSelected.concat(this.state.selected.slice(1));
      } else if (selectedIndex === this.state.selected.length - 1) {
        newSelected = newSelected.concat(this.state.selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          this.state.selected.slice(0, selectedIndex),
          this.state.selected.slice(selectedIndex + 1),
        );
      }
    } 

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleQtyChange = (event, rowId) => {
    let newTableData = this.state.menuData;
    newTableData.map((current,index) => {
      if(current.id === rowId) {
        newTableData[index]['availableQuantity'] = event.target.value;
      }
    });
    
    this.setState({menuData: newTableData}); //New table set and view updated
    
  }

  handleMaxQtyChange = (event, rowId) => {
    let newTableData = this.state.menuData;
    newTableData.map((current,index) => {
      if(current.id === rowId) {
        newTableData[index]['maxQuantity'] = event.target.value;
      }
    });
    
    this.setState({menuData: newTableData}); //New table set and view updated
    
  }

  placeOrder = () => {
    const selectedItems = this.state.selected;
    const menuData = this.state.menuData;
    const orderData = [];

    menuData.map(current => {
      if(selectedItems.indexOf(current.name) > -1 ) {
        orderData.push(current);
      }
    });

    if(orderData.length === 0) {
      alert('Please select items and quantity of items to create menu');
      return;
    }

    const payload = {
      "id": null,
      "vendorId": this.userId,
      "items": orderData,
      "validFor":null     
    }
    fetch('http://10.16.34.17:8090/cafe/dm', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(res => {
        let newTableData = this.state.menuData;
        this.setState({showalert: true, order: 'asc',
        orderBy: 'id',
        selected: [],
        page: 0
        });
        setTimeout(() => {
          this.setState({showalert: false, menuData: newTableData})
        },3000)
    })
  }

  render() {
    const isSelected = name => this.state.selected.indexOf(name) !== -1;

    const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.menuData.length - this.state.page * this.state.rowsPerPage);

    return (
      <div className='order-table-panel'>
        {this.state.showalert && (<Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          {`Today's menu created successfully!!`}
        </Alert>)}
        <h3>Today's menu</h3>
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
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;
  
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            onClick={event => this.handleClick(event, row)}
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.price}</TableCell>
                        <TableCell>
                          <TextField
                          id="availableQuantity"
                          value={row.availableQuantity}
                          InputLabelProps={{
                              shrink: true,
                          }}
                          onChange ={(e)=> this.handleQtyChange(e, row.id)}
                          />
                      </TableCell>
                      <TableCell hidden>{row.id}</TableCell>
                      <TableCell>
                        <TextField id="maxQuantity"
                          value={row.maxQuantity}
                          InputLabelProps={{
                              shrink: true,
                          }}
                          onChange ={(e)=> this.handleMaxQtyChange(e, row.id)} />
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
        <Button variant="contained" color="primary" 
          disabled={this.state.selected.length > 0 ? false : true} 
          onClick={() => this.placeOrder()}
          className='place-order-button'>
          Create Menu
        </Button>
      </div>
    );
  }
}
