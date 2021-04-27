import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import '../common.css';

class SearchBar extends Component {

    constructor() {
        super();
    
        this.state = {
            gridData: [],
            term: null,
            search: '',
            gridColumns: [
                {  headerName: 'Symbol' },
                {  headerName: 'Name' }
    
            ],
        };
    
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
      }
    
    handleChange(e) {
        this.setState({
            search: e.target.value
        });
    }
    
    // handle event for button click
    handleClick(e) {
        //if(e) e.preventDefault();

        this.setState({
            search: '',
            term: this.state.search

        });

        let url = "https://ticker-2e1ica8b9.now.sh/keyword/" + this.state.search

        const requestOptions = {
            method: "GET",
            crossDomain: true,
            //mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
        };  

        // call API to fetch live stock info
        fetch(url, requestOptions)
        .then(response => {
            return response.json();
        })
        .then(data => {
            this.setState({
                gridData: data
            });
        })
        .catch(error => {
            console.log(error);
        });

    }

    // handle event for cell click - redirect to stock view page with ticker symbol
    // onCellClick(symbol) {

    //     //href={`/stock/${stock.stockTicker}`

    //   }

    render(){
        return(
        <div className="SearchBar">
            <input onChange={ this.handleChange } className="SearchBar__Input" />
            <button onClick={ this.handleClick } className="SearchBar__Button">search</button>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        {
                            this.state.gridColumns.map((header) => (
                                <TableCell> {header.headerName} </TableCell>
                            ))
                        }
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.gridData.map((row) => (
                                <TableRow>
                                    <TableCell align="left">{row.symbol}</TableCell>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">
                                    {/* <Button
                                        onClick={this.onCellClick.bind(this, row.symbol)}
                                        color="primary"
                                        >
                                        View
                                        </Button> */}
                                         <Link href={ `/stock/${row.symbol}` }> View</Link>
                                    </TableCell>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>   
        </div>
        )
    }
}
export default SearchBar;