import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import apiClient from "../libs/apiClient";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import StockLineGraph from "../components/StockLineGraph";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import LinkIcon from "@material-ui/icons/Link";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import Loading from "./../components/Loading";
import { FormHelperText, FormLabel, FormControlLabel } from "@material-ui/core";
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
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(2),
  },
}));
const ProfilePage = () => {
  const classes = useStyles();
  let { id } = useParams();
  const [username, setusername] = useState();
  const [buyingpower, setbuyingpower] = useState(0);
  const [address, setaddress] = useState();
  const [phonenum, setphonenum] = useState();
  const [email, setemail] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await apiClient(`/api/user/sushrut/info`, {
          method: "GET",
        });

        setusername(user.user);
        setbuyingpower(user.buyingPower);
        setaddress(user.address);
        setphonenum(user.phone);
        setemail(user.email);
      } catch (error) {}
    }
    fetchData();

    return () => {
      // cleanup
    };
  }, []);

  return (
    <div className={classes.root}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item xs={6}>
          <Paper style={{ padding: 18 }}>
            <Typography variant="h6">Account Details</Typography>
            <List className={classes.flexContainer}>
              <ListItemText>Name</ListItemText>
              <ListItemText>{username}</ListItemText>
            </List>
            <List className={classes.flexContainer}>
              <ListItemText>Buying Power</ListItemText>
              <ListItemText>{buyingpower}</ListItemText>
            </List>
            <List className={classes.flexContainer}>
              <ListItemText>Address</ListItemText>
              <ListItemText>{address}</ListItemText>
            </List>
            <List className={classes.flexContainer}>
              <ListItemText>Phone Number</ListItemText>
              <ListItemText>{phonenum}</ListItemText>
            </List>
            <List className={classes.flexContainer}>
              <ListItemText>Email</ListItemText>
              <ListItemText>{email}</ListItemText>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfilePage;
