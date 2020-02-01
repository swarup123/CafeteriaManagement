import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

function createData(id, details, price , orderedAt, waitingTime,status) {
  return { id, details, price , orderedAt, waitingTime,status};
}

const rows = [
  createData('111', 'idli', 20, '24/1/2020 5:40 PM', 10 , 'confirmed'),
  createData('112', 'Dosa & Vada', 40, '21/1/2020 9:40 AM', 10 , 'delivered'),
  createData('113', 'idli', 20, '26/1/2020 5:40 PM', 10 , 'confirmed'),
  createData('114', 'idli', 20, '27/1/2020 5:40 PM', 10 , 'confirmed'),
  createData('118', 'idli', 20, '29/1/2020 5:40 PM', 10 , 'confirmed')
 
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});



export default function CustomizedTables() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const mobileNum = '1234566';

  useEffect(() => {
    fetch(
      `https://api.cafeteria.com/myorders?mobileNum=${mobileNum}`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/json"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setRows(response.data);
      })
      .catch(error => console.log(error));
  }, [mobileNum]);

 
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Order ID</StyledTableCell>
            <StyledTableCell align="right">Details</StyledTableCell>
            <StyledTableCell align="right">Price&nbsp;(Rs)</StyledTableCell>
            <StyledTableCell align="right">Order Date</StyledTableCell>
            <StyledTableCell align="right">Waiting Time&nbsp;(mins)</StyledTableCell>
            <StyledTableCell align="right">Order Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.details}</StyledTableCell>
              <StyledTableCell align="right">{row.price}</StyledTableCell>
              <StyledTableCell align="right">{row.orderedAt}</StyledTableCell>
              <StyledTableCell align="right">{row.waitingTime}</StyledTableCell>
              <StyledTableCell align="right"><Button variant="contained" color="secondary">
  {row.status}
</Button></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}