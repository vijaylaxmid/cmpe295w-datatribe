import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import apiClient from "../libs/apiClient";
import Typography from "@material-ui/core/Typography";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import {
  FormHelperText,
  FormLabel,
  FormControlLabel,
  Divider,
} from "@material-ui/core";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
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
  profilestyle: {
    height: 300,
    width: "100%",
    padding: 20,
    color: theme.palette.text.secondary,
  },
}));

const Transactions = () => {
  const classes = useStyles();

  const [transactionData, settransactionData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const transactiondata = await apiClient(
          `/api/portfolio/user/abc/transactions`,
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
      <Grid container alignItems="center" justify="center" spacing={2}>
        <Grid item xs={8}>
          <Paper style={{ padding: 30 }}>
            <Typography variant="h4" style={{ padding: 10 }}>
              Transaction History
            </Typography>
            <Divider></Divider>
            <div className={classes.profilestyle}>
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
                components={{
                  Toolbar: CustomToolbar,
                }}
                sortModel={[
                  {
                    field: "date",
                    sort: "asc",
                  },
                ]}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
export default Transactions;
