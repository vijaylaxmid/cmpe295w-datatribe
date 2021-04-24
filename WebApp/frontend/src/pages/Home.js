import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import StockList from '../components/StockList';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: '85vh',
    display: "flex",
    flexDirection: "column",
  },
  graphContainer: {
    height: "50%"
  },
  newsContainer: {
    height: "50%"
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
              Graph Container
            </div>
            <div className={classes.newsContainer}>
               News Container
            </div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <StockList></StockList>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}