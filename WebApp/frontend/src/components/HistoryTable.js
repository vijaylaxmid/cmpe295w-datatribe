import React, { Component } from "react";
import { Table } from "react-bootstrap";
class HistoryTable extends Component {
  render() {
    return (
      <Table size="sm">
        <thead>
          <tr>
            <th>Stock Name</th>

            <th>Transaction Date</th>

            <th>Amount</th>

            <th>Mode of Transaction</th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    );
  }
}

export default HistoryTable;
