import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import StockList from '../components/StockList';
import StockGraph from '../components/StockGraph';
import Newsfeed from '../components/Newsfeed';
import PredictionsList from '../components/PredictionsList';
import Typography from '@material-ui/core/Typography';

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
  bottom: {
    height: '100%',
  },
  graphContainer: {
    height: "60%"
  },
  newsContainer: {
    height: "50%",
    display: 'flex',
  },
  predictions: {
    width: "60%"
  },
  news: {
    width: "40%"
  }
}));

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Paper className={classes.paper}>
            <div className={classes.graphContainer}>
              <StockGraph></StockGraph>
            </div>
            <div className={classes.newsContainer}>
              <div className={classes.predictions}>
                <Typography variant="button" gutterBottom>
                  Predictions
                </Typography>

                <PredictionsList />
              </div>
              <div className={classes.news}>
                <Typography variant="button" gutterBottom>
                  News
                </Typography>

                <Newsfeed></Newsfeed>
              </div>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.bottom}>
            <StockList></StockList>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}