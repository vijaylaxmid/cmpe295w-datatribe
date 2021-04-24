import React from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";

import LoginButton from "./LoginButton";
import Profile from "./Profile";
import { Redirect } from "react-router-dom";

const styles = {
  flex: {
    flex: 1,
  },
};

const AppHeader = ({ classes }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        Stock Trading App
      </Typography>
      <div className={classes.flex} />
      <LoginButton />
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(AppHeader);
