import React from 'react';
import {
  Typography,
} from '@material-ui/core';

export default () => (
  <Typography variant="h4">History Page</Typography>
);

// import React, { useEffect, useState } from 'react'
// import { makeStyles } from '@material-ui/core/styles';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import ListItemText from '@material-ui/core/ListItemText';
// import Avatar from '@material-ui/core/Avatar';
// import IconButton from '@material-ui/core/IconButton';
// import LinkIcon from '@material-ui/icons/Link';
// import ShowChartIcon from '@material-ui/icons/ShowChart';
// import apiClient from "../libs/apiClient";
// import Loading from './../components/Loading';
// import ErrorSnackbar from './../components/ErrorSnackBar';

// const useStyles = makeStyles((theme) => ({
//     root: {
//         flexGrow: 1,
//         overflow: 'auto'
//     },
// }));

// function ListItemLink(props) {
//     return <ListItem button component="a" {...props} />;
// }

// const TransactionHistory = (props) => {
//     const classes = useStyles();
//     useEffect(() => {
//         // function getTotalStocks(stocks) {
//         //     return stocks.reduce((total, stock, index, array) => {
//         //         if (stock.transactionType === "buy") {
//         //             total += stock.numberOfStocks
//         //         } else {
//         //             total -= stock.numberOfStocks
//         //         }
//         //         return total
//         //     }, 0)
//         // }
//         async function fetchData() {
//             try {
//                 const stocks = await apiClient('/api/portfolio/user/abc/transactions', { method: "GET" });
//                 // const tickers = [...new Set(stocks.map(item => item.stockTicker))];
//                 // const result = tickers.map(tick => {
//                 //     const stockTrans = stocks.filter(st => st.stockTicker === tick);
//                 //     return {
//                 //         stockTicker: tick,
//                 //         numberOfStocks: getTotalStocks(stockTrans)
//                 //     }
//                 // })
//                 setStocks(stocks);
//                 setLoading(false);
//             } catch (error) {
//                 setLoading(false);
//                 setError(error);
//             }
//         }
//         fetchData();
        
//         return () => {
//             // cleanup
//         }
//     }, [])
//     const [loading, setLoading] = useState(true);
//     const [stocks, setStocks] = useState([])
//     const [error, setError] = useState(null);
//     // const classes = useStyles();

//     return (

//         <div>
//             <List>
//                 {loading ? <Loading></Loading> :
//                     stocks.map((stock) => {
//                         return <ListItemLink key={stock.stockTicker} href={`/stock/${stock.stockTicker}`}>
//                             <ListItemAvatar>
//                                 <Avatar>
//                                     <ShowChartIcon />
//                                 </Avatar>
//                             </ListItemAvatar>
//                             <ListItemText
//                                 primary={stock.stockTicker}
//                                 secondary={`Shares: ${stock.numberOfStocks}`}
//                             />
//                             <ListItemText
//                                 primary={stock.transactionType}
//                             />
//                             <ListItemSecondaryAction>
//                                 <IconButton edge="end" aria-label="delete">
//                                     <LinkIcon />
//                                 </IconButton>
//                             </ListItemSecondaryAction>
//                         </ListItemLink>
//                     })
//                 }

//             </List>
//             {error && (
//             <ErrorSnackbar
//                 onClose={() => this.setState({ error: null })}
//                 message={this.state.error.message}
//             />
//             )}
//         </div>
//     )
// }

// export default TransactionHistory;
