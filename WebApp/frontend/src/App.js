import React from "react";

import Profile from "./components/Profile";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

import PasswordChangeForm from "./components/Password";
import PhoneChangeForm from "./components/Phone";
import HistoryForm from "./components/HistoryForm";
function App() {
  return (
    <Router>
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Stock App</NavbarBrand>

          <Nav navbar>
            <NavItem>
              <NavLink href="/api/user/rimzim/info">Profile</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/password">Change Password</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/phone">Change Phone Number</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/history">History</NavLink>
            </NavItem>
          </Nav>
        </Navbar>

        <Switch>
          <Route path="/api/user/rimzim/info">
            <Profile />
          </Route>
          <Route path="/password">
            <PasswordChangeForm />
          </Route>
          <Route path="/phone">
            <PhoneChangeForm />
          </Route>
          <Route path="/history">
            <HistoryForm></HistoryForm>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
