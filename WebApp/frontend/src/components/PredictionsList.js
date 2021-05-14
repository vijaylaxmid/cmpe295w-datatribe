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
import Typography from '@material-ui/core/Typography';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import { green, red } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

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
                <Box>
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


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: "95%"
    },
    predictions: {
        height: '95%',
        overflow: 'auto',
        padding: 0
    },
    paper: {
        width: "60%",
        padding: theme.spacing(2),
        overflow: 'auto',
        height: '100%'
    },
    red: {
        color: '#fff',
        backgroundColor: red[500],
    },
    green: {
        color: '#fff',
        backgroundColor: green[500],
    },
}));

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

const PredictionsList = () => {
    const classes = useStyles();
    useEffect(() => {
        async function fetchData() {
            try {
                const predictions = await apiClient('/api/stock/predictions/all', { method: "GET" });
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
    const [predictions, setPredictions] = useState({})
    const [error, setError] = useState(null);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const positivePredictions = Object.keys(predictions).filter(key => {
        const prevDay = predictions && Array.isArray(predictions[key]) ? predictions[key][0] : {};
        const nextDay = predictions && Array.isArray(predictions[key]) ? predictions[key][1] : {};
        const percentage = ((Number(nextDay.adj_close_1_days) - Number(prevDay.adj_close_1_days)) / Number(prevDay.adj_close_1_days) * 100).toFixed(2);
        return percentage >= 0
    });

    const positivePredictionsSorted = positivePredictions.sort((a, b) => {
        const prevDayA = predictions && Array.isArray(predictions[a]) ? predictions[a][0] : {};
        const nextDayA = predictions && Array.isArray(predictions[a]) ? predictions[a][1] : {};
        const percentageA = ((Number(nextDayA.adj_close_1_days) - Number(prevDayA.adj_close_1_days)) / Number(prevDayA.adj_close_1_days) * 100).toFixed(2);
        const prevDayB = predictions && Array.isArray(predictions[b]) ? predictions[b][0] : {};
        const nextDayB = predictions && Array.isArray(predictions[b]) ? predictions[b][1] : {};
        const percentageB = ((Number(nextDayB.adj_close_1_days) - Number(prevDayB.adj_close_1_days)) / Number(prevDayB.adj_close_1_days) * 100).toFixed(2);
        return percentageB - percentageA;
    });

    const negativePredictions = Object.keys(predictions).filter(key => {
        const prevDay = predictions && Array.isArray(predictions[key]) ? predictions[key][0] : {};
        const nextDay = predictions && Array.isArray(predictions[key]) ? predictions[key][1] : {};
        const percentage = ((Number(nextDay.adj_close_1_days) - Number(prevDay.adj_close_1_days)) / Number(prevDay.adj_close_1_days) * 100).toFixed(2);
        return percentage < 0
    });

    const negativePredictionsSorted = negativePredictions.sort((a, b) => {
        const prevDayA = predictions && Array.isArray(predictions[a]) ? predictions[a][0] : {};
        const nextDayA = predictions && Array.isArray(predictions[a]) ? predictions[a][1] : {};
        const percentageA = ((Number(nextDayA.adj_close_1_days) - Number(prevDayA.adj_close_1_days)) / Number(prevDayA.adj_close_1_days) * 100).toFixed(2);
        const prevDayB = predictions && Array.isArray(predictions[b]) ? predictions[b][0] : {};
        const nextDayB = predictions && Array.isArray(predictions[b]) ? predictions[b][1] : {};
        const percentageB = ((Number(nextDayB.adj_close_1_days) - Number(prevDayB.adj_close_1_days)) / Number(prevDayB.adj_close_1_days) * 100).toFixed(2);
        return percentageA - percentageB;
    });

    return (
        <div className={classes.root}>
            <div className={classes.root}>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Trending Up" {...a11yProps(0)} />
                        <Tab label="Trending Down" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} className={classes.predictions} index={0}>
                    <List>
                        {
                            positivePredictionsSorted.map((key) => {
                                const prevDay = predictions ? predictions[key][0] : {};
                                const nextDay = predictions ? predictions[key][1] : {};
                                const percentage = ((Number(nextDay.adj_close_1_days) - Number(prevDay.adj_close_1_days)) / Number(prevDay.adj_close_1_days) * 100).toFixed(2);
                                return <ListItemLink key={key} href={`/stock/${key}`}>
                                    <ListItemAvatar>
                                        <Avatar className={percentage < 0 ? classes.red : classes.green}>
                                            {percentage < 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${key} : Stock is expected to go ${percentage > 0 ? 'up' : 'down'} by ${Math.abs(percentage)}%`}
                                        secondary={`Trend :  USD ${Number(prevDay.adj_close_1_days).toFixed(2)} -> USD ${Number(nextDay.adj_close_1_days).toFixed(2)}`}
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
                </TabPanel>
                <TabPanel value={value} className={classes.predictions} index={1}>
                    <List>
                        {
                            negativePredictions.map((key) => {
                                const prevDay = predictions ? predictions[key][0] : {};
                                const nextDay = predictions ? predictions[key][1] : {};
                                const percentage = ((Number(nextDay.adj_close_1_days) - Number(prevDay.adj_close_1_days)) / Number(prevDay.adj_close_1_days) * 100).toFixed(2);
                                return <ListItemLink key={key} href={`/stock/${key}`}>
                                    <ListItemAvatar>
                                        <Avatar className={percentage < 0 ? classes.red : classes.green}>
                                            {percentage < 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${key} : Stock is expected to go ${percentage > 0 ? 'up' : 'down'} by ${Math.abs(percentage)}%`}
                                        secondary={`Trend :  USD ${Number(prevDay.adj_close_1_days).toFixed(2)} -> USD ${Number(nextDay.adj_close_1_days).toFixed(2)}`}
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
                </TabPanel>
            </div>

        </div>
    )
}

export default PredictionsList
