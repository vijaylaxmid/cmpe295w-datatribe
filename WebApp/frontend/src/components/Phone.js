import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel, Button } from "react-bootstrap";

class PhoneChangeForm extends Component {
  render() {
    return (
      <div>
        <form>
          <FormGroup xs="6">
            <FormLabel>Old Phone Number</FormLabel>
            <FormControl value="12345678" />
          </FormGroup>
          <hr />
          <FormGroup xs="6">
            <FormLabel>New Phone Number</FormLabel>
            <FormControl value="98766543" />
          </FormGroup>

          <Button>Change Phone Number</Button>
        </form>
      </div>
    );
  }
}

export default PhoneChangeForm;
