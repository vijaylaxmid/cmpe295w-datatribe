import React, { useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import apiClient from "../libs/apiClient";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { Height } from '@material-ui/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import Loading from './Loading';
import ErrorSnackbar from './ErrorSnackBar';


function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
        height: '80%'
    },
    paper: {
        maxWidth: 600,
        padding: theme.spacing(2),
        overflow: 'auto',
        height: '100%'
    },
}));
const Newsfeed = () => {
    const classes = useStyles();

    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState([])
    const [error, setError] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const news = await apiClient('/api/business/news', { method: "GET" });
                setNews(news.articles);
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
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom>
                    News
                </Typography>
                <List>
                    {loading ? <Loading></Loading> :
                        news.map((n, index) => {
                            return <ListItemLink key={index} href={n.url}>
                                <ListItemAvatar>
                                    <Avatar>
                                        W
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={n.title}
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
                {/* {
                    news.map(((n, index) => {
                        return <Grid key={index} container wrap="nowrap" spacing={2}>
                            <Grid item>
                                <Avatar>N</Avatar>
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <Typography noWrap>{n.title}</Typography>
                            </Grid>
                        </Grid>
                    }))
                } */}

            </Paper>
        </div>
    )
}

export default Newsfeed
