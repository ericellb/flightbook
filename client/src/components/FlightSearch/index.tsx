import React from "react";
import { makeStyles, Container } from "@material-ui/core";
import BackgroundImage from "../FlightSearch/backgroundImage.jpg";
import FlightSearchForm from "../FlightSearchForm";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    height: "calc(100vh - 128px)",
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
  searchForm: {
    padding: "64px",
    zIndex: 10
  }
}));

export default function FlightSearch() {
  const classes = useStyles({});
  return (
    <div className={classes.container}>
      <div className={classes.imageOverlay} />
      <div className={classes.searchForm}>
        <FlightSearchForm />
      </div>
    </div>
  );
}
