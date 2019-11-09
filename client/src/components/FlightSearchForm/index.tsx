import React, { useState } from "react";
import { makeStyles, Button } from "@material-ui/core";
import FlightSegment from "./FlightSegment";

const useStyles = makeStyles(theme => ({
  container: {
    padding: "32px",
    background: "#fff",
    width: "500px"
  },
  addRemoveFlightsWrapper: {},
  addRemoveFlightButton: {
    marginRight: "8px"
  }
}));

export default function FlightSearchForm() {
  const classes = useStyles({});
  const [numberSegments, setNumberSegments] = useState(2);

  // Adds or removes a segment of flights
  const addRemoveSegment = (action: string) => {
    if (action === "add") {
      numberSegments === 5
        ? setNumberSegments(5)
        : setNumberSegments(numberSegments + 1);
    } else if (action === "remove") {
      numberSegments === 1
        ? setNumberSegments(1)
        : setNumberSegments(numberSegments - 1);
    }
  };

  return (
    <div className={classes.container}>
      {[...Array(numberSegments)].map((e, i) => {
        return (
          <div>
            <FlightSegment segmentNumber={i + 1} />
          </div>
        );
      })}
      <div className={classes.addRemoveFlightsWrapper}>
        <Button
          variant="contained"
          color="primary"
          className={classes.addRemoveFlightButton}
          onClick={() => addRemoveSegment("add")}
        >
          Add a Flight
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.addRemoveFlightButton}
          onClick={() => addRemoveSegment("remove")}
        >
          Remove a Flight
        </Button>
      </div>
    </div>
  );
}
