import React, { useState } from "react";
import { makeStyles, Button, ButtonGroup } from "@material-ui/core";
import FlightSegment, { TripType } from "./FlightSegment";

const useStyles = makeStyles(theme => ({
  container: {
    padding: "32px",
    background: "#fff",
    width: "500px"
  },
  addRemoveFlightsWrapper: {},
  addRemoveFlightButton: {
    marginRight: "8px"
  },
  tripTypeInputWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px"
  },
  tripButton: {
    fontWeight: 500
  },
  tripButtonSelected: {
    background: "#eceaea",
    boxShadow: "inset 0 0 5px 0 rgba(0,0,0,0.1)"
  }
}));

export interface Segment {
  seg_from: string;
  seg_to: string;
  seg_date_from: Date | null;
  seg_date_to: Date | null;
}

export default function FlightSearchForm() {
  const classes = useStyles({});

  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [numberSegments, setNumberSegments] = useState(1);
  const [segment, setSegment] = useState<Segment[]>([
    { seg_from: "", seg_to: "", seg_date_from: null, seg_date_to: null },
    { seg_from: "", seg_to: "", seg_date_from: null, seg_date_to: null },
    { seg_from: "", seg_to: "", seg_date_from: null, seg_date_to: null },
    { seg_from: "", seg_to: "", seg_date_from: null, seg_date_to: null },
    { seg_from: "", seg_to: "", seg_date_from: null, seg_date_to: null }
  ]);

  const updateTripType = (value: TripType) => {
    setTripType(value);
    value === "multi" ? setNumberSegments(2) : setNumberSegments(1);
  };

  // Adds or removes a segment of flights
  const addRemoveSegment = (action: string) => {
    let tmpNumberSegments = numberSegments;
    if (action === "add") {
      numberSegments === 5
        ? (tmpNumberSegments = 5)
        : (tmpNumberSegments = numberSegments + 1);
    } else if (action === "remove") {
      numberSegments === 1
        ? (tmpNumberSegments = 1)
        : (tmpNumberSegments = numberSegments - 1);
    }
    setNumberSegments(tmpNumberSegments);
  };

  return (
    <div className={classes.container}>
      <div className={classes.tripTypeInputWrapper}>
        <ButtonGroup>
          <Button
            onClick={() => updateTripType("roundtrip")}
            className={
              tripType === "roundtrip"
                ? classes.tripButtonSelected
                : classes.tripButton
            }
          >
            Round Trip
          </Button>
          <Button
            onClick={() => updateTripType("oneway")}
            className={
              tripType === "oneway"
                ? classes.tripButtonSelected
                : classes.tripButton
            }
          >
            One way
          </Button>
          <Button
            onClick={() => updateTripType("multi")}
            className={
              tripType === "multi"
                ? classes.tripButtonSelected
                : classes.tripButton
            }
          >
            Multi-City
          </Button>
        </ButtonGroup>
      </div>

      {[...Array(numberSegments)].map((e, i) => {
        return (
          <FlightSegment
            segmentNumber={i}
            segment={segment[i]}
            setSegment={setSegment}
            type={tripType}
          />
        );
      })}

      {tripType === "multi" ? (
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
      ) : null}
    </div>
  );
}