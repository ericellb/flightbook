import React from "react";
import { makeStyles } from "@material-ui/core";
import BackgroundImage from "../FlightSearch/backgroundImage.jpg";
import FlightSearchForm from "../FlightSearchForm";
import { HashRouter, Route } from "react-router-dom";
import FlightResults from "../FlightResults";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    minHeight: "calc(100vh - 128px)",
    background: `#081015 url(${BackgroundImage})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      height: "calc(100vh - 120px)"
    }
  },
  imageOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    background: "black",
    opacity: 0.3
  },
  content: {
    padding: "64px",
    zIndex: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: "16px"
    }
  }
}));

export default function FlightSearch() {
  const classes = useStyles({});
  return (
    <div className={classes.container}>
      <div className={classes.imageOverlay} />
      <div className={classes.content}>
        <HashRouter>
          <Route path="/" exact component={FlightSearchForm} />
          <Route path="/flights" exact component={FlightResults} />
        </HashRouter>
      </div>
    </div>
  );
}
