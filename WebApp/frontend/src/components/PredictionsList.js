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

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        overflow: 'auto',
        padding: theme.spacing(0, 3),
        height: '75%'
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

    return (
        <div className={classes.root}>
            <List>
                {
                    Object.keys(predictions).map((key) => {
                        const prevDay = predictions ? predictions[key][0] : {};
                        const nextDay = predictions ? predictions[key][1] : {};
                        const percentage = ((Number(nextDay.adj_close_1_days) - Number(prevDay.adj_close_1_days)) / Number(prevDay.adj_close_1_days) * 100).toFixed(2);
                        return <ListItemLink key={key}>
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
        </div>
    )
}

export default PredictionsList
