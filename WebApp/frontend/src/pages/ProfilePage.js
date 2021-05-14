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
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import avatar from "./../static/images/profile.jpeg";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import HomeIcon from "@material-ui/icons/Home";
import NumberFormat from "react-number-format";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";

let HEIGHT = window.screen.height;
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
    width: theme.spacing(50),
    flexDirection: "row",
    padding: theme.spacing(2),
  },

  profileImage: {
    position: "relative",

    justifyContent: "center",
    width: theme.spacing(30),
    height: theme.spacing(30),
    border: "5px solid white",
    margin: "auto",
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 0,
    padding: 20,
  },
  textInfo: {
    margin: "auto",
  },
  profilestyle: {
    color: theme.palette.text.secondary,
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
        const user = await apiClient(`/api/user/abc/info`, {
          method: "GET",
        });

        setusername(user.userName);
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
      <Grid container alignItems="center" justify="center" spacing={2}>
        <Grid item xs={6} className={classes.profilestyle}>
          <Paper style={{ padding: 18 }}>
            <Avatar
              alt={username}
              className={classes.profileImage}
            ></Avatar>
            <Typography
              align={"center"}
              className={classes.userName}
              variant="h3"
              gutterBottom
              style={{ color: "#3f51b5" }}
            >
              {username}
            </Typography>
            <List className={classes.flexContainer}>
              <AccountBalanceWalletIcon
                style={{ fontSize: 50 }}
                color="primary"
              ></AccountBalanceWalletIcon>
              <Typography variant="h5" className={classes.textInfo}>
                <NumberFormat
                  value={buyingpower}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </Typography>
            </List>
            <List className={classes.flexContainer}>
              <HomeIcon style={{ fontSize: 50 }} color="primary"></HomeIcon>
              <Typography variant="h5" className={classes.textInfo}>
                {address}
              </Typography>
            </List>
            <List className={classes.flexContainer}>
              <PhoneIcon style={{ fontSize: 50 }} color="primary"></PhoneIcon>
              <Typography variant="h5" className={classes.textInfo}>
                <NumberFormat
                  value={phonenum}
                  displayType={"text"}
                  format="+1 (###) ###-####"
                  mask="_"
                />
              </Typography>
            </List>
            <List className={classes.flexContainer}>
              <EmailIcon style={{ fontSize: 50 }} color="primary"></EmailIcon>
              <Typography variant="h5" className={classes.textInfo}>
                {email}
              </Typography>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfilePage;
