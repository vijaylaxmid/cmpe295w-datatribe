import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel, Button } from "react-bootstrap";

class PasswordChangeForm extends Component {
  render() {
    return (
      <div className="ChangePassword">
        <form>
          <FormGroup xs="6" controlId="oldPassword">
            <FormLabel>Old Password</FormLabel>
            <FormControl type="password" value="test456" />
          </FormGroup>
          <hr />
          <FormGroup xs="6" controlId="password">
            <FormLabel>New Password</FormLabel>
            <FormControl type="password" value="test456" />
          </FormGroup>
          <FormGroup xs="6" controlId="confirmPassword">
            <FormLabel>Confirm Password</FormLabel>
            <FormControl type="password" value="test123" />
          </FormGroup>
          <Button>Change Password</Button>
        </form>
      </div>
    );
  }
}

export default PasswordChangeForm;
