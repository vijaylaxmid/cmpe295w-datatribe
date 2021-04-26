import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import apiClient from "../libs/apiClient";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import StockLineGraph from "../components/StockLineGraph";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import LinkIcon from "@material-ui/icons/Link";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import Loading from "./../components/Loading";
import { DataGrid } from "@material-ui/data-grid";
import { FormHelperText, FormLabel, FormControlLabel } from "@material-ui/core";

const data = [
  {
    id: 1,
    transactionType: "erty",
    stockTicker: "Snow",
    price: "Snow",
    stocks: "Jon",
    date: "35",
    mode: "Milwaukee",
  },
  {
    id: 2,
    transactionType: "erty",
    stockTicker: "Snow",
    price: "Snow",
    stocks: "Jon",
    date: "35",
    mode: "Milwaukee",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: "87vh",
    display: "flex",
    flexDirection: "column",
  },
  buySell: {
    color: theme.palette.text.secondary,
    height: "50%",
  },
  innerBuySell: {
    height: "250px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: theme.spacing(2),
  },
  left: {
    height: "100%",
    padding: theme.spacing(2),
  },
  tabBody: {
    height: "100%",
  },
  graphContainer: {
    height: "60%",
  },
  newsContainer: {
    height: "50%",
    display: "flex",
  },
  newsGrid: {
    height: "100%",
    overflow: "auto",
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(2),
  },
}));

const Transactions = () => {
  const classes = useStyles();

  const [transactionData, settransactionData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const transactiondata = await apiClient(
          `/api/portfolio/user/sushrut/transactions`,
          {
            method: "GET",
          }
        );
        settransactionData(transactiondata);
      } catch (error) {}
    }
    fetchData();

    return () => {
      // cleanup
    };
  }, []);
  return (
    <div className={classes.root}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item xs={8}>
          <Paper style={{ padding: 30 }}>
            <Typography variant="h6">Transaction History</Typography>
            <div style={{ height: 250, width: "100%", padding: 20 }}>
              <DataGrid
                rows={transactionData}
                columns={[
                  {
                    field: "transactionType",
                    width: 200,
                    headerName: "Transaction Type",
                  },
                  {
                    field: "stockTicker",
                    width: 150,
                    headerName: "Stock Ticker",
                  },
                  { field: "price", width: 150, headerName: "Price" },
                  { field: "numberOfStocks", width: 150, headerName: "Stocks" },
                  { field: "date", width: 200, headerName: "Date" },
                  { field: "mode", width: 200, headerName: "Mode" },
                ]}
                pageSize={6}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
export default Transactions;
