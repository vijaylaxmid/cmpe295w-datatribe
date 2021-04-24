import React, { Component } from "react";
import { Container, Col, Label, Row } from "reactstrap";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import PasswordChangeForm from "./Password";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "rimzim",
      phonenumber: "",
      email: "",
    };
  }
  componentDidMount() {
    console.log("here 123456");
    const apiUrl = "/api/user/rimzim/info";
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          username: data.userName,
          phonenumber: data.phone,
          email: data.email,
        })
      );
  }
  render() {
    return (
      <Router>
        <div>
          <Container>
            <Row>
              <Col xs="6" sm="4">
                <Label>Username</Label>
              </Col>
              <Col xs="6" sm="4">
                <Label>{this.state.username}</Label>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col xs="6" sm="4">
                <Label>Email</Label>
              </Col>
              <Col xs="6" sm="4">
                <Label>{this.state.email}</Label>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col xs="6" sm="4">
                <Label>Phone Number</Label>
              </Col>
              <Col xs="6" sm="4">
                <Label>{this.state.phonenumber}</Label>
              </Col>
            </Row>
          </Container>

          <div>
            <Link to="/password">Change Password</Link>
          </div>
          <Switch>
            <Route path="/password" component={PasswordChangeForm}></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Profile;
