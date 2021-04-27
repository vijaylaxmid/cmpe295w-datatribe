// import React, { Component } from 'react';
// import {
//   Select,
//   MenuItem
// } from '@material-ui/core';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';


// class SearchGrid extends Component {
    
//     constructor(props) {

//       super(props);
//       this.state= { 
//         gridColumns: [
//             { field: 'id', headerName: 'ID', width: 70 },
//             { field: 'category', headerName: 'Category' },
//             { field: 'industry', headerName: 'Industry' },
//             { field: 'stockSymbol', headerName: 'Ticker'},

//         ],
//         category: '',
//         categoryData: [
//         ],
//         industry: '',
//         industryData: [
//         ],
//         gridData: [
//         ]
//       };
//       this.handleChangeCategory = this.handleChangeCategory.bind(this);
//       this.handleChangeIndustry = this.handleChangeIndustry.bind(this);
//       this.handleSearchClick = this.handleSearchClick.bind(this);
//     }
    

//     componentDidMount() {
//         const requestOptions = {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         };  

//         // fetch category data
//         fetch("http://127.0.0.1:5000/api/portfolio/categories", requestOptions)
//         .then(response => {
//             return response.json();
//         })
//         .then(data => {
//             let companies = data;
//             console.log(companies);
//             this.setState({
//                 categoryData: companies
//             });
//         })
//         .catch(error => {
//             console.log(error);
//         });

//         // fetch industry data
//         fetch("http://127.0.0.1:5000/api/portfolio/industries", requestOptions)
//         .then(response => {
//             return response.json();
//         })
//         .then(data => {
//             let industries = data;
//             console.log(industries);
//             this.setState({
//                 industryData: industries
//             });
//         })
//         .catch(error => {
//             console.log(error);
//         });

//         // fetch all stock data - without search criteria
//         const gridRequestOptions = {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 "category": "CAT 1",
//                 "industry": "IND 1"
//             }),
//         }; 

//         fetch("http://127.0.0.1:5000/api/portfolio/searchstock", gridRequestOptions)
//         .then(response => {
//             return response.json();
//         })
//             .then(data => {
//             // let companies = Object.keys(data.rates);
//             debugger
//             this.setState({
//                 gridData: data
//             });
//         })
//         .catch(error => {
//             console.log(error);
//         });
//     }
    
//     renderCategoryOptions() {
//       return this.state.categoryData.map((dt, i) => {
//         return (
//           <MenuItem
//             key={dt.categoryId}
//             value={dt.categoryName}>
//             {dt.categoryName}
//           </MenuItem>
//         );
//       });
//     }

//     renderIndustryOptions() {
//         return this.state.industryData.map((dt, i) => {
//           return (
//             <MenuItem
//               key={dt.industryId}
//               value={dt.industryName}>
//               {dt.industryName}
//             </MenuItem>
//           );
//         });
//       }
  
//     handleChangeCategory(event){
//         this.setState({ category: event.target.value });
//     }

//     handleChangeIndustry(event){
//         this.setState({ industry: event.target.value });
//     }
    
//     handleSearchClick(event){
//         //this.setState({ industry: event.target.value });
//         let cat = this.state.category;
//         let ind = this.state.industry;
//         alert(cat + ind)
//     }
  
//     render(){
//       return (
//         <div>
//             <label>Category</label>
//             <Select
//             value={this.state.category}
//             onChange={this.handleChangeCategory}
//             >
//             {this.renderCategoryOptions()}
//             </Select>

//             <label>Industry</label>
//             <Select
//             value={this.state.industry}
//             onChange={this.handleChangeIndustry}
//             >
//             {this.renderIndustryOptions()}
//             </Select>

//             <button>Search</button>

//             <TableContainer component={Paper}>
//                 <Table aria-label="simple table">
//                     <TableHead>
//                     <TableRow>
//                         {
//                             this.state.gridColumns.map((header) => (
//                                 <TableCell> {header.headerName} </TableCell>
//                             ))
//                         }
//                     </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {
//                             this.state.gridData.map((row) => (
//                                 <TableRow key={row.id}>
//                                     <TableCell align="left">{row.id}</TableCell>
//                                     <TableCell align="left">{row.category}</TableCell>
//                                     <TableCell align="left">{row.industry}</TableCell>
//                                     <TableCell align="left">{row.stockSymbol}</TableCell>
//                                 </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </div>
//       )}
//   }
//   export default SearchGrid;
