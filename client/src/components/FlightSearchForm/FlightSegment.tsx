import React, { useState } from "react";
import { makeStyles, TextField } from "@material-ui/core";
import { AirplanemodeActive, DateRange } from "@material-ui/icons";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles(theme => ({
  flightSegment: {},
  segmentTitle: {
    marginBottom: "4px",
    color: "#2b2e4a",
    fontWeight: 500
  },
  flightInputWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "16px"
  },
  flightInputLabel: {
    width: "20%",
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
    width: "80%",
    [`& fieldset`]: {
      borderRadius: 0
    },
    [`& input`]: {
      padding: "10px 8px"
    }
  },
  flightDateInputWrapper: {
    height: "39px",
    width: "80%",
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

interface FlightSegmentProps {
  segmentNumber: number;
}

export default function FlightSegment(props: FlightSegmentProps) {
  const classes = useStyles({});

  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);

  const handleDateChange = (date: any) => {
    setDateOpen(false);
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className={classes.segmentTitle}>Flight {props.segmentNumber}</div>
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
            open={dateOpen}
            onOpen={() => setDateOpen(true)}
            onClick={() => setDateOpen(true)}
            onClose={() => setDateOpen(false)}
            value={selectedDate}
            onChange={handleDateChange}
            className={classes.flightDateInputWrapper}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
        </div>
      </div>
    </MuiPickersUtilsProvider>
  );
}
