import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import apiClient from "../libs/apiClient";
import Loading from './Loading';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import StockLineGraph from './StockLineGraph';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
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
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

const StockGraph = () => {
    const classes = useStyles();
    useEffect(() => {
        async function fetchData() {
            try {
                const stocks = await apiClient('/api/portfolio/user/abc/transactions', { method: "GET" });
                setStocks(stocks);
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
    const tickers = [...new Set(stocks.map(item => item.stockTicker))];
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {
                        tickers.map(tick => {
                            return <Tab id={tick} label={tick} {...a11yProps(tick)} />
                        })
                    }
                </Tabs>
            </AppBar>
            {
                tickers.map((tick, index) => {
                    return <TabPanel value={value} index={index}>
                        <StockLineGraph key={tick} stockTicker={tick} />
                        {/* <Line
                            key={tick}
                            data={state}
                            width={100}
                            height={35}
                        /> */}
                        </TabPanel>
                })
            }
            
        </div>
    )
}

export default StockGraph;
