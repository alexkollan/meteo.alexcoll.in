import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './page'; // Adjust the import based on your file structure

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

console.log("theme page")

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Home />
  </ThemeProvider>,
  document.getElementById('root')
);
