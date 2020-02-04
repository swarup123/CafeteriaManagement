import React from 'react';
import Chart from "react-apexcharts";
import res from './res.json';
import LogoutMenu from '../OrderPage/OrderDropdown';
class BarChartReport extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {  
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: ["Date"]
      }
    },
    series: [
      {
        name: "series-1",
        data: ["Sales"]
      }
    ]
  };
}
  async componentDidMount() {
    try {
      let response = await fetch("http://10.16.34.17:8090/cafe/vendor/orders");
      let responsea = await fetch(res);
      let orders = await response.json();
      //let orders = res;
      let sales = [];
      let dates = [];
      let dateMap = {};
      console.log("orders--",orders);
      if (orders) {
        orders.forEach(order => {
          console.log("order--",order);
          if(order['orderTime'])
          {
            let dt = new Date(order['orderTime']); 
            let total = dateMap[dt.toDateString()];
            if(!total)
            {
              total = 0;
            }
            total = total+order['total'];
            console.log("order--",order);  
            dateMap[dt.toDateString()] = total;
          }        
        });
        console.log("dateMap--",dateMap);
        for (var date in dateMap) {
          if (dateMap.hasOwnProperty(date)) {
            sales.push(dateMap[date]);
            dates.push(date);
          }
        }
        this.setState({ options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: dates
          }
        },
           series: [
            {
              name: "Sales",
              data: sales
            }
          ] });
      }
    } catch (err) {
    }
  }
    render() {
      return (
        <div className="app">
          <a href="http://localhost:3000/vendorQueue" >Back</a>
          <h3>Daily Sales</h3>
          <div className="row">
            <div className="mixed-chart">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                width="500"
              />
            </div>
          </div>
        </div>        
      );
    }
  }

  export default BarChartReport;
