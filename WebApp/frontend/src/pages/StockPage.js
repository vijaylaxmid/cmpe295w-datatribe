import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import apiClient from "../libs/apiClient";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import StockLineGraph from '../components/StockLineGraph';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import ShowChartIcon from '@material-ui/icons/ShowChart';
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
    return Number(num).toFixed(2);
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        height: '87vh',
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
    newsContainer: {
        height: "50%",
        display: 'flex',
    },
    newsGrid: {
        height: "90%",
        overflow: 'auto'
    }
}));


const StockPage = () => {
    let { id } = useParams();
    const classes = useStyles();
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stockInfo, setStockInfo] = useState({});
    const [shares, setShares] = useState(0);
    const [sharestoBuyOrSell, setSharestoBuyOrSell] = useState(0);
    let history = useHistory();

    useEffect(() => {
        async function fetchData() {
            try {
                const news = await apiClient(`/api/stock/news?symbol=${id}`, { method: "GET" });
                const info = await apiClient(`/api/stock/quote?symbol=${id}`, { method: "GET" });
                const stocks = await apiClient('/api/portfolio/user/abc/transactions', { method: "GET" });
                const stockTrans = stocks.filter(st => st.stockTicker === id);
                const totalShares = stockTrans.reduce((total, stock, index, array) => {
                    if (stock.transactionType === "buy") {
                        total += stock.numberOfStocks
                    } else {
                        total -= stock.numberOfStocks
                    }
                    return total
                }, 0)

                setShares(totalShares);
                setNews(news.articles);
                setStockInfo(info);
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

    const performBuyOrSell = (transactionType) => {
        apiClient('/api/portfolio/transaction', {
            method: 'POST',
            body: JSON.stringify({
                date: new Date().toDateString(),
                mode: "manual",
                numberOfStocks: sharestoBuyOrSell,
                price: 0,
                stockTicker: id,
                transactionType: transactionType,
                user: "abc"
            })
        }).then(() => {
            history.push('/')
        })
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className={classes.root}>
            { loading ? <Loading></Loading> :
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Paper className={classes.left}>
                            <Typography variant="h6">{`${stockInfo.shortName} (${id})`}</Typography>
                            <List className={classes.root}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ShowChartIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary='# Shares' secondary={shares} />
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ShowChartIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary='Current Value' secondary={`USD ${nFormatter(shares * stockInfo.regularMarketPreviousClose)}`} />
                                </ListItem>
                                <Divider />

                            </List>
                            <Paper className={classes.buySell}>
                                <AppBar position="static">
                                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                        <Tab label="Buy" {...a11yProps(0)} />
                                        <Tab label="Sell" {...a11yProps(1)} />
                                    </Tabs>
                                </AppBar>
                                <TabPanel value={value} index={0} className={classes.tabBody}>
                                    <Paper className={classes.innerBuySell}>
                                        <TextField id="outlined-basic" label="Number Of Shares To Buy" value={sharestoBuyOrSell} onChange={handleBuyOrSellChange} variant="outlined" />
                                        <Typography variant="caption">{`An amount (USD) ${Number(sharestoBuyOrSell * stockInfo.regularMarketPreviousClose).toFixed(2)} will be deducted from your account`}</Typography>
                                        <Button variant="contained" onClick={() => performBuyOrSell("buy")}>Buy</Button>
                                    </Paper>
                                </TabPanel>
                                <TabPanel value={value} index={1} className={classes.tabBody}>
                                    <Paper className={classes.innerBuySell}>
                                        <TextField id="outlined-basic" label="Number Of Shares to Sell" value={sharestoBuyOrSell} onChange={handleBuyOrSellChange} variant="outlined" />
                                        <Typography variant="caption">{`An amount (USD) ${Number(sharestoBuyOrSell * stockInfo.regularMarketPreviousClose).toFixed(2)} will be added to your account`}</Typography>
                                        <Button variant="contained" onClick={() => performBuyOrSell("sell")}>Sell</Button>
                                    </Paper>
                                </TabPanel>
                            </Paper>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper className={classes.paper}>
                            <div className={classes.graphContainer}>
                                <StockLineGraph stockTicker={id}></StockLineGraph>
                            </div>
                            <div className={classes.newsContainer}>
                                <Grid container spacing={3} >

                                    <Grid item xs={6} className={classes.newsGrid}>
                                        <Typography variant="button">Stock Details</Typography>
                                        <List>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <ShowChartIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary='High' secondary={stockInfo.dayHigh} />
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <ShowChartIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary='Low' secondary={stockInfo.dayLow} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <ShowChartIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary='Volume' secondary={nFormatter(stockInfo.volume)} />
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <ShowChartIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary='MarketCap' secondary={nFormatter(stockInfo.marketCap)} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <ShowChartIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary='Type' secondary={stockInfo.quoteType} />
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <ShowChartIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary='P/E' secondary={nFormatter(stockInfo.trailingPE)} />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid item xs={5} className={classes.newsGrid}>
                                        <Typography variant="button">News</Typography>

                                        <List>
                                            {loading ? <Loading></Loading> :
                                                news.map((n, index) => {
                                                    return <ListItemLink key={index} href={n.url}>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                N
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            secondary={n.title}
                                                        // econdary={`Shares: ${stock.numberOfStocks} - Amount ${stock.price}`}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <IconButton edge="end" aria-label="delete">
                                                                <LinkIcon />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItemLink>
                                                })
                                            }
                                        </List>
                                    </Grid>

                                </Grid>
                            </div>
                        </Paper>
                    </Grid>

                </Grid>
            }
        </div>
    )
}

export default StockPage
