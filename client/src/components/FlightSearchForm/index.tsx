import React from "react";
import { makeStyles, TextField, InputAdornment } from "@material-ui/core";
import { AirplanemodeActive } from "@material-ui/icons";
import FlightSegment from "./FlightSegment";

const useStyles = makeStyles(theme => ({
  container: {
    padding: "32px",
    background: "#fff",
    width: "500px"
  }
}));

export default function FlightSearchForm() {
  const classes = useStyles({});
  return (
    <div className={classes.container}>
      <FlightSegment />
    </div>
  );
}
