import React from "react";
import { Route, useHistory } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import Home from "./pages/Home";
// import Login from './pages/Login';
import ProfilePage from "./pages/ProfilePage";
import StockPage from "./pages/StockPage";
import Transactions from "./pages/Transactions";
import Search from "./pages/SearchPage";

// import config from './app.config';
// import AppHeader from './components/AppHeader';

const AppWithRouterAccess = () => {
  return (
    <>
      <SecureRoute path="/" exact={true} component={Home} />
      <SecureRoute path="/stock/:id" component={StockPage} />
      <SecureRoute path="/profile" component={ProfilePage} />
      <SecureRoute path="/transactions" component={Transactions} />
      <SecureRoute path="/search" component={Search} />
      <Route path="/login/callback" component={LoginCallback} />
    </>
  );
};
export default AppWithRouterAccess;
