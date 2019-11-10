import React, { useState } from "react";
import { makeStyles, Button, ButtonGroup } from "@material-ui/core";
import FlightSegment, { TripType } from "./FlightSegment";
import moment, { Moment } from "moment";
import axios from "../AxiosClient";
import { useDispatch } from "react-redux";
import { updateFlights } from "../../actions";
import createHashHistory from "../../history";

const useStyles = makeStyles(theme => ({
  container: {
    padding: "24px",
    background: "#fff",
    width: "500px"
  },
  addRemoveFlightsWrapper: {},
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
  },
  searchFlightWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "16px"
  },
  searchFlightButton: {
    height: "54px",
    fontSize: "18px"
  }
}));

export interface Segment {
  seg_from: string;
  seg_to: string;
  seg_date_from: Moment | null;
  seg_date_to: Moment | null;
}

export default function FlightSearchForm() {
  const classes = useStyles({});
  const dispatch = useDispatch();

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
      numberSegments === 5 ? (tmpNumberSegments = 5) : (tmpNumberSegments = numberSegments + 1);
    } else if (action === "remove") {
      numberSegments === 1 ? (tmpNumberSegments = 1) : (tmpNumberSegments = numberSegments - 1);
    }
    setNumberSegments(tmpNumberSegments);
  };

  const searchFlights = async () => {
    let searchQuery = `type=${tripType}`;

    if (tripType === "multi") {
      searchQuery += numberSegments;
    }

    for (let i = 0; i < numberSegments; i++) {
      let tmpFromDate = segment[i].seg_date_from;
      let tmpToDate = segment[i].seg_date_to;
      if (tmpFromDate) {
        searchQuery += `&seg${i}_from=${segment[i].seg_from.split(" ")[0]}`;
        searchQuery += `&seg${i}_to=${segment[i].seg_to.split(" ")[0]}`;
        searchQuery += `&seg${i}_date=${moment(tmpFromDate).format("MMM-D-YYYY")}`;
      }
      if (tripType === "roundtrip" && tmpToDate) {
        searchQuery += `&seg1_from=${segment[i].seg_to.split(" ")[0]}`;
        searchQuery += `&seg1_to=${segment[i].seg_from.split(" ")[0]}`;
        searchQuery += `&seg1_date=${moment(tmpToDate).format("MMM-D-YYYY")}`;
      }
    }
    try {
      let res: any = await axios.get(`/api/search?${searchQuery}`);
      let flightData = res.data.trips;
      dispatch(updateFlights(flightData));
      createHashHistory.push("/flights");
    } catch {}
  };

  return (
    <div className={classes.container}>
      <div className={classes.tripTypeInputWrapper}>
        <ButtonGroup>
          <Button
            onClick={() => updateTripType("roundtrip")}
            className={tripType === "roundtrip" ? classes.tripButtonSelected : classes.tripButton}
          >
            Round Trip
          </Button>
          <Button
            onClick={() => updateTripType("oneway")}
            className={tripType === "oneway" ? classes.tripButtonSelected : classes.tripButton}
          >
            One way
          </Button>
          <Button
            onClick={() => updateTripType("multi")}
            className={tripType === "multi" ? classes.tripButtonSelected : classes.tripButton}
          >
            Multi-City
          </Button>
        </ButtonGroup>
      </div>

      {[...Array(numberSegments)].map((e, i) => {
        let minDate: Moment | null = moment();
        if (segment[i - 1] !== undefined) {
          minDate = segment[i - 1].seg_date_from;
        }
        return (
          <FlightSegment
            segmentNumber={i}
            segment={segment[i]}
            setSegment={setSegment}
            type={tripType}
            minDate={minDate}
          />
        );
      })}

      {tripType === "multi" ? (
        <div className={classes.addRemoveFlightsWrapper}>
          <ButtonGroup>
            <Button onClick={() => addRemoveSegment("add")}>Add a Flight</Button>
            <Button onClick={() => addRemoveSegment("remove")}>Remove a Flight</Button>
          </ButtonGroup>
        </div>
      ) : null}

      <div className={classes.searchFlightWrapper}>
        <Button color="primary" variant="contained" className={classes.searchFlightButton} onClick={searchFlights}>
          Search Flights
        </Button>
      </div>
    </div>
  );
}
