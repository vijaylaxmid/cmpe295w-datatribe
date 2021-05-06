import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import apiClient from "../libs/apiClient";
import Loading from './Loading';
import ErrorSnackbar from './ErrorSnackBar';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import { green, red } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
    red: {
        color: '#fff',
        backgroundColor: red[500],
    },
    green: {
        color: '#fff',
        backgroundColor: green[500],
    },
    appBar: {
        backgroundColor: "#03a9f4        ",
    }
}));

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

const StockList = (props) => {
    const classes = useStyles();
    useEffect(() => {
        function getTotalStocks(stocks) {
            return stocks.reduce((total, stock, index, array) => {
                if (stock.transactionType === "buy") {
                    total += stock.numberOfStocks
                } else {
                    total -= stock.numberOfStocks
                }
                return total
            }, 0)
        }
        async function fetchData() {
            try {
                const stocks = await apiClient('/api/portfolio/user/abc/transactions', { method: "GET" });
                const predictions = await apiClient('/api/stock/predictions/all', { method: "GET" });
                const tickers = [...new Set(stocks.map(item => item.stockTicker))];
                const result = tickers.map(tick => {
                    const stockTrans = stocks.filter(st => st.stockTicker === tick);
                    return {
                        stockTicker: tick,
                        numberOfStocks: getTotalStocks(stockTrans)
                    }
                })
                setStocks(result);
                setPredictions(predictions);
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
    const [loading, setLoading] = useState(true);
    const [stocks, setStocks] = useState([]);
    const [predictions, setPredictions] = useState({})
    const [error, setError] = useState(null);

    return (
        <div>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <ListItemText
                        primary="USD 10K"
                        secondary="Buying Power"
                    />
                    <ListItemText
                        primary="USD 135K"
                        secondary="Current Value"
                    />
                </Toolbar>
            </AppBar>
            <List>
                {loading ? <Loading></Loading> :
                    stocks.map((stock) => {
                        const prevDay = predictions ? predictions[stock.stockTicker][0] : {};
                        const nextDay = predictions ? predictions[stock.stockTicker][1] : {};
                        const percentage = ((Number(nextDay.adj_close_1_days) - Number(prevDay.adj_close_1_days)) / Number(prevDay.adj_close_1_days) * 100).toFixed(2);
                        return <ListItemLink key={stock.stockTicker} href={`/stock/${stock.stockTicker}`}>
                            <ListItemAvatar>
                                <Avatar className={percentage < 0 ? classes.red : classes.green}>
                                    {percentage < 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={stock.stockTicker}
                                secondary={`# Shares: ${stock.numberOfStocks}`}
                            />
                            <ListItemText
                                primary={`Next day prediction: ${Math.abs(percentage)}%`}
                                secondary={`USD ${Number(prevDay.adj_close_1_days).toFixed(2)} -> USD ${Number(nextDay.adj_close_1_days).toFixed(2)}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete">
                                    {percentage < 0 ? <TrendingDownIcon style={{ color: red[500] }} fontSize="large" /> : <TrendingUpIcon style={{ color: green[500] }} fontSize="large" />}
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItemLink>
                    })
                }

            </List>
            {error && (
                <ErrorSnackbar
                    onClose={() => this.setState({ error: null })}
                    message={this.state.error.message}
                />
            )}
        </div>
    )
}

export default StockList;
