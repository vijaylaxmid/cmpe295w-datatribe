import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import apiClient from "../libs/apiClient";
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Loading from './../components/Loading';
// import ErrorSnackbar from './ErrorSnackBar';
import { Divider } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import { TablePagination } from '@material-ui/core';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

function nFormatter(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        // height   : '87vh',
        display: "flex",
        flexDirection: "column",
    },
    buySell: {
        color: theme.palette.text.secondary,
        height: '50%',
    },
    innerBuySell: {
        height: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: theme.spacing(2),

    },
    left: {
        height: '100%',
        padding: theme.spacing(2),
    },
    tabBody: {
        height: '100%',
    },
    graphContainer: {
        height: "60%"
    },
    rowC: {
        display: "flex",
        width: '100%'
    }
}));


const PaperTrade = () => {
    let { id } = useParams();
    const classes = useStyles();
    const [account, setAccount] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [positions, setPositions] = useState({});
    const [orders, setOrders] = useState(0);
    const [sharestoBuyOrSell, setSharestoBuyOrSell] = useState(0);
    const [tickerSymbol, setTickerSymbol] = useState();
    const [timeToForce, setTimeToForce] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [ordersRowsPerPage, setOrdersRowsPerPage] = React.useState(5);
    const [ordersPage, setOrdersPage] = React.useState(0);
    const [page, setPage] = React.useState(0);
    let history = useHistory();

    useEffect(() => {
        async function fetchData() {
            try {
                const accountDetails = await apiClient(`/api/trade/getaccountdetails`, { method: "GET" });
                const orders = await apiClient(`/api/trade/listOrders`, 
                                { method: "POST",
                                  body: JSON.stringify({
                                        status: "all",
                                        limit: 100
                                    })
                                });
                const positions = await apiClient('/api/trade/getAllPositions', { method: "GET" });
                

                setAccount(accountDetails);
                setOrders(orders);
                // setPositions(positionArray);
                setPositions(positions);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error);
            }
        }
        fetchData();


        return () => {
            // cleanup
        }
    }, [])

    const handleBuyOrSellChange = (event) => {
        setSharestoBuyOrSell(event.target.value);
    };
    const handleTickerSymbolChange = (event) => {
        setTickerSymbol(event.target.value);
    };

    const performBuyOrSell = (transactionType) => {
        async function submit(transactionType) {
            try {
                let result = await apiClient('/api/trade/submitOrders ', {
                    method: 'POST',
                    body: JSON.stringify({
                        symbol: tickerSymbol,
                        quantity: sharestoBuyOrSell,
                        side: transactionType,
                        type: "market",
                        timeInForce: "gtc"
                    })
                })
                debugger
                if (result.status === "order placed"){
                    alert("order placed")
                    window.location.reload();
                }
                else{
                    alert("order denied");
                    window.location.reload();
                }
            } catch (error) {
                alert("something went wrong")
            }
        } 
        // .then(() => {
        //     debugger
        //     alert("order submitted")
        //     history.push('/')
        //     window.location.reload();
        // })
        submit(transactionType);
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    
    const handleOrdersChangePage = (event, newPage) => {
        debugger
        setOrdersPage(newPage);
      };
    
    const handleOrdersChangeRowsPerPage = (event) => {
        debugger
        setOrdersRowsPerPage(parseInt(event.target.value, 10));
        setOrdersPage(0);
      };
    
    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);


    const positionsColumns = [
        { field: 'stock', headerName: 'Stock', width: 70 },
        { field: 'price', headerName: 'Price' },
        { field: 'shares', headerName: 'Shares' },
        { field: 'marketValue', headerName: 'Market Value'},
        // { field: 'totalProfit', headerName: 'Total Profit'},
    ]

    const orderColumns = [
        { field: 'stock', headerName: 'Stock', width: 70 },
        { field: 'order', headerName: 'Order' },
        { field: 'shares', headerName: 'Shares' },
        { field: 'pricepershare', headerName: 'Price Per Share'},
        { field: 'amount', headerName: 'Amount'},
        { field: 'status', headerName: 'Status'},

    ]
    return (
        <div className={classes.root}>
            { loading ? <Loading></Loading> :
                <Grid>
                    <Grid>
                                <Paper className={classes.paper}>  
                                    <Typography variant="h5"> Account Details </Typography>
                                    <b>{` $ ${account.equity} Equity `}</b>
                                    <b>{`$ ${account.buying_power} Buying Power`}</b>
                                </Paper>
                                <Paper className={classes.paper}>
                                    <Paper className={classes.buySell}>
                                        <AppBar position="static">
                                            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                                <Tab label="Buy" {...a11yProps(0)} />
                                                <Tab label="Sell" {...a11yProps(1)} />
                                            </Tabs>
                                        </AppBar>
                                        <TabPanel value={value} index={0} className={classes.tabBody}>
                                            <Paper className={classes.innerBuySell}>
                                                <TextField id="outlined-basic" label="Symbol" value={tickerSymbol} onChange={handleTickerSymbolChange} variant="outlined" />
                                                <TextField id="outlined-basic" label="Number Of Shares To Buy" value={sharestoBuyOrSell} onChange={handleBuyOrSellChange} variant="outlined" />
                                                {/* <TextField id="outlined-basic" label="Number Of Shares To Buy" value={sharestoBuyOrSell} onChange={handleBuyOrSellChange} variant="outlined" /> */}
                                                <Button variant="contained" onClick={() => performBuyOrSell("buy")}>Buy</Button>
                                            </Paper>
                                        </TabPanel>
                                        <TabPanel value={value} index={1} className={classes.tabBody}>
                                            <Paper className={classes.innerBuySell}>
                                                <TextField id="outlined-basic" label="Symbol" value={tickerSymbol} onChange={handleTickerSymbolChange} variant="outlined" />
                                                <TextField id="outlined-basic" label="Number Of Shares to Sell" value={sharestoBuyOrSell} onChange={handleBuyOrSellChange} variant="outlined" />
    
                                                <Button variant="contained" onClick={() => performBuyOrSell("sell")}>Sell</Button>
                                            </Paper>
                                        </TabPanel>
                                    </Paper>
                                </Paper>
                                
                                <Paper className={classes.paper}>
                                    <TableContainer component={Paper}>
                                        <Typography variant="h6"> Portfolio </Typography>
                                            <Table aria-label="simple table">
                                                <TableHead>
                                                <TableRow>
                                                    {
                                                        positionsColumns.map((header) => (
                                                            <TableCell> {header.headerName} </TableCell>
                                                        ))
                                                    }
                                                </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        positions
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row) => (
                                                            <TableRow key={row.id}>
                                                                <TableCell align="left">
                                                                    <Link href={ `/stock/${row._raw.symbol}` }>{row._raw.symbol}</Link>
                                                                </TableCell>
                                                                <TableCell align="left">{row._raw.avg_entry_price}</TableCell>
                                                                <TableCell align="left">{row._raw.qty}</TableCell>
                                                                <TableCell align="left">{ row._raw.market_value } </TableCell>
                                                                {/* <TableCell align="left">{ row._raw.qty * row._raw.filled_avg_price } </TableCell> */}
                                                            </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={positions.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                        />
                                </Paper>
                                <Paper className={classes.paper}>
                                    <TableContainer component={Paper}>
                                        <Typography variant="h6"> Order History </Typography>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                            <TableRow>
                                                {
                                                    orderColumns.map((header) => (
                                                        <TableCell> {header.headerName} </TableCell>
                                                    ))
                                                }
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    orders
                                                    .slice(ordersPage * ordersRowsPerPage, ordersPage * ordersRowsPerPage + ordersRowsPerPage)
                                                    .map((row) => (
                                                        <TableRow key={row._raw.id}>
                                                            <TableCell align="left">
                                                                <Link href={ `/stock/${row._raw.symbol}` }>{row._raw.symbol}</Link>
                                                            </TableCell>
                                                            <TableCell align="left">{row._raw.order_type} {row._raw.side} {row._raw.filled_at}</TableCell>
                                                            <TableCell align="left">{row._raw.qty}</TableCell>
                                                            <TableCell align="left">{ row._raw.filled_avg_price } </TableCell>
                                                            <TableCell align="left">{ row._raw.qty * row._raw.filled_avg_price } </TableCell>
                                                            <TableCell align="left">{row._raw.status}</TableCell>
                                                        </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={orders.length}
                                        rowsPerPage={ordersRowsPerPage}
                                        page={ordersPage}
                                        onChangePage={handleOrdersChangePage}
                                        onChangeRowsPerPage={handleOrdersChangeRowsPerPage}
                                        />
                                </Paper>
                    </Grid>

                </Grid>
            }
        </div>
    )
}

export default PaperTrade
