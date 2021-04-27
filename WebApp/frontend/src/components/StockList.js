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

const useStyles = makeStyles((theme) => ({

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
                const tickers = [...new Set(stocks.map(item => item.stockTicker))];
                const result = tickers.map(tick => {
                    const stockTrans = stocks.filter(st => st.stockTicker === tick);
                    return {
                        stockTicker: tick,
                        numberOfStocks: getTotalStocks(stockTrans)
                    }
                })
                setStocks(result);
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
    const [stocks, setStocks] = useState([])
    const [error, setError] = useState(null);

    return (
        <div>
            <List>
                {loading ? <Loading></Loading> :
                    stocks.map((stock) => {
                        return <ListItemLink key={stock.stockTicker} href={`/stock/${stock.stockTicker}`}>
                            <ListItemAvatar>
                                <Avatar>
                                    <ShowChartIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={stock.stockTicker}
                                secondary={`Shares: ${stock.numberOfStocks}`}
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
