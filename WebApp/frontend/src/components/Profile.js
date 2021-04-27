import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: "87vh",
    display: "flex",
    flexDirection: "column",
  },
  buySell: {
    color: theme.palette.text.secondary,
    height: "50%",
  },
  innerBuySell: {
    height: "250px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: theme.spacing(2),
  },
  left: {
    height: "100%",
    padding: theme.spacing(2),
  },
  tabBody: {
    height: "100%",
  },
  graphContainer: {
    height: "60%",
  },
  newsContainer: {
    height: "50%",
    display: "flex",
  },
  newsGrid: {
    height: "100%",
    overflow: "auto",
  },
}));
const ProfilePage = () => {
  const classes = useStyles();
  let { id } = useParams();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}></Grid>
    </div>
  );
};

export default ProfilePage;
