
import React from 'react';
import { Link } from 'react-router-dom';

import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  withStyles,
} from '@material-ui/core';
import { withOktaAuth } from '@okta/okta-react';
import LoginButton from "./LoginButton";
import { withRouter } from 'react-router-dom';

const styles = {
  flex: {
    flex: 1,
  },
  tabLink: {
    display: "flex",
    alignItems: "center",
  }
};

class AppHeader extends React.Component {
  state = {
    authenticated: false,
    user: null,
    value: 0,
  };

  componentDidUpdate() {
    this.checkAuthentication();
  }

  componentDidMount() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = this.props.authState ? this.props.authState.isAuthenticated : false;
    const user = this.props.authService ? await this.props.authService.getUser() : null;
    if (authenticated !== this.state.authenticated) {
      this.setState({
        authenticated,
      })
    }
  }

  handleChange = (event, newValue) => {
    // event.preventDefault();
    this.setState({ value: newValue });
  };
  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Stock Trading Application
          </Typography>
          {
            this.state.authenticated ?
              <>
                <Tabs>
                  <Tab key="dashboard" label="Dashboard" component={Link} className={this.props.classes.tabLink} to="/"></Tab>
                  <Tab key="profile" label="User Profile" component={Link} className={this.props.classes.tabLink} to="/profile"></Tab>
                </Tabs>
              </>
              : null
          }
          <div className={this.props.classes.flex} />
          <LoginButton />
        </Toolbar>
      </AppBar>
    );
  }

}

export default withRouter(withOktaAuth(withStyles(styles)(AppHeader)));