"use strict";
import React, { Component } from "react";
import HistoryTable from "./HistoryTable";
import { Button } from "reactstrap";

const headerStyle = {
  textAlign: "center",
};

const buttonStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  marginBottom: 20,
};

class HistoryForm extends Component {
  render() {
    return (
      <div>
        <h1 style={headerStyle}>History</h1>
        <div style={buttonStyle}>
          <h5>Recent History</h5>
          <div>
            <Button>Download</Button>
          </div>
        </div>

        <HistoryTable></HistoryTable>
      </div>
    );
  }
}

export default HistoryForm;
