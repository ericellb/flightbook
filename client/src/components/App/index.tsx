import React from "react";
import "./style.css";
import Header from "../Header";
import Footer from "../Footer";
import FlightSearch from "../FlightSearch";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <FlightSearch />
      <Footer />
    </ThemeProvider>
  );
}

export const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "14px",
        backgroundColor: "black"
      }
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: "#2a5bd7",
        color: "white",
        fontFamily: "Roboto"
      }
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#fff"
      }
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600
  }
});
