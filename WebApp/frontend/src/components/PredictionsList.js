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

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        overflow: 'auto',
        padding: theme.spacing(0, 3),
        height: '80%'
    },
    paper: {
        maxWidth: 400,
        padding: theme.spacing(2),
        overflow: 'auto',
        height: '100%'
    },
}));

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

const PredictionsList = () => {
    const classes = useStyles();
    const predictions = [
        {
            stockTicker: 'MSFT',
            percentage: '2%'
        },
        {
            stockTicker: 'TSLA',
            percentage: '-2%'
        },
        {
            stockTicker: 'GOOGL',
            percentage: '1%'
        },
        {
            stockTicker: 'AAPL',
            percentage: '2%'
        }
    ]
    return (
        <div className={classes.root}>
            <Typography variant="h6" gutterBottom>
                Predictions
            </Typography>
            <List>
                {
                    predictions.map((stock) => {
                        return <ListItemLink key={stock.stockTicker}>
                            <ListItemAvatar>
                                <Avatar>
                                    <ShowChartIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={stock.stockTicker}
                                secondary={`Change ${stock.percentage}`}
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
