import React, { useState } from 'react';
import SearchGrid from '../components/SearchGrid';
import SearchBar from '../components/SearchBar';

import {
  Typography,
} from '@material-ui/core';




export default function Search()  {

  return(
    <div>
      {/* <SearchGrid/> */}
      <SearchBar/>
    </div>
  ); 
  
};