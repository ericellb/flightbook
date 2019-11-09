import React, { useState, Fragment } from "react";
import { makeStyles, TextField } from "@material-ui/core";
import { AirplanemodeActive, DateRange } from "@material-ui/icons";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment, { Moment } from "moment";
import { Segment } from ".";
import { object } from "prop-types";

const useStyles = makeStyles(theme => ({
  flightSegment: {},
  segmentTitle: {
    marginBottom: "4px",
    color: "#2b2e4a",
    fontWeight: 500
  },
  flightInputWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px"
  },
  flightInputLabel: {
    width: "18%",
    background: "#f1f1f1",
    color: "#777",
    height: "39px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px",
    boxSizing: "border-box",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRight: "none"
  },
  flightAirportLabelFromIcon: {
    transform: "rotate(45deg)"
  },
  flightAirportLabelToIcon: {
    transform: "rotate(-45deg)"
  },
  flightAirportInput: {
    width: "82%",
    [`& fieldset`]: {
      borderRadius: 0
    },
    [`& input`]: {
      padding: "10px 8px"
    }
  },
  flightDateInputWrapper: {
    height: "39px",
    width: "32%",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    boxSizing: "border-box",
    [`& label`]: {
      paddingLeft: "8px",
      paddingTop: "8px"
    },
    [`& div.MuiInput-formControl`]: {
      paddingLeft: "8px",
      top: "4px"
    },
    [`& div.MuiInput-underline:before`]: {
      borderBottom: "none !important"
    },
    [`& div.MuiInput-underline:after`]: {
      borderBottom: "none !important"
    }
  }
}));

export type TripType = "oneway" | "roundtrip" | "multi";

interface FlightSegmentProps {
  segmentNumber: number;
  segment: Segment;
  setSegment: Function;
  minDate: Moment | null;
  type: TripType;
}

export default function FlightSegment(props: FlightSegmentProps) {
  const classes = useStyles({});

  // Dates for our date picker
  let minDate = props.minDate;
  if (minDate === null) {
    minDate = moment();
  }
  let maxDate = moment().add(1, "year");

  let minDateTo = props.segment.seg_date_from;

  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  const handleDateChange = (property: string, date: any) => {
    if (minDate) {
      // Fixes a bug with Material Datepicker and value + minvalue onChange...
      if (moment(minDate).date() !== moment(date).date()) {
        if (property === "seg_date_from") {
          setDateFromOpen(false);
        }
      }
    }

    if (minDateTo) {
      // Fixes a bug with Material Datepicker and value + minvalue onChange...
      if (moment(minDateTo).date() !== moment(date).date()) {
        if (property === "seg_date_to") {
          setDateToOpen(false);
        }
      }
    }

    handleSegmentChange(property, date);
  };

  const handleSegmentChange = (property: string, value: string | Date) => {
    props.setSegment((segment: any) =>
      segment.map((item: any, index: any) =>
        index === props.segmentNumber ? { ...item, [property]: value } : item
      )
    );
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {props.type === "multi" ? (
        <div className={classes.segmentTitle}>
          Flight {props.segmentNumber + 1}
        </div>
      ) : null}
      <div className={classes.flightSegment}>
        <div className={classes.flightInputWrapper}>
          <div className={classes.flightInputLabel}>
            <AirplanemodeActive
              className={classes.flightAirportLabelFromIcon}
            />
            From
          </div>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Leaving from"
            className={classes.flightAirportInput}
            value={props.segment.seg_from}
            onChange={e => handleSegmentChange("seg_from", e.target.value)}
          />
        </div>
        <div className={classes.flightInputWrapper}>
          <div className={classes.flightInputLabel}>
            <AirplanemodeActive className={classes.flightAirportLabelToIcon} />
            To
          </div>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Going to"
            className={classes.flightAirportInput}
            value={props.segment.seg_to}
            onChange={e => handleSegmentChange("seg_to", e.target.value)}
          />
        </div>
        <div className={classes.flightInputWrapper}>
          <div className={classes.flightInputLabel}>
            <DateRange />
            Depart
          </div>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            id="date-picker-inline"
            placeholder="Pick a Date"
            open={dateFromOpen}
            minDate={minDate}
            maxDate={maxDate}
            onOpen={() => setDateFromOpen(true)}
            onClick={() => setDateFromOpen(true)}
            onClose={() => setDateFromOpen(false)}
            value={props.segment.seg_date_from}
            onChange={e => handleDateChange("seg_date_from", e)}
            className={classes.flightDateInputWrapper}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
          {props.type === "roundtrip" ? (
            <Fragment>
              <div
                className={classes.flightInputLabel}
                style={{ marginLeft: "8px" }}
              >
                <DateRange />
                Return
              </div>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                id="date-picker-inline"
                placeholder="Pick a Date"
                open={dateToOpen}
                minDate={minDateTo}
                maxDate={maxDate}
                onOpen={() => setDateToOpen(true)}
                onClick={() => setDateToOpen(true)}
                onClose={() => setDateToOpen(false)}
                value={props.segment.seg_date_to}
                onChange={e => handleDateChange("seg_date_to", e)}
                className={classes.flightDateInputWrapper}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
            </Fragment>
          ) : null}
        </div>
      </div>
    </MuiPickersUtilsProvider>
  );
}
