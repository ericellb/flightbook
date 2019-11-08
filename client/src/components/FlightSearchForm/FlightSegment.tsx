import React, { useState } from "react";
import { makeStyles, TextField, InputAdornment } from "@material-ui/core";
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
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1em",
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
    }
  },
  flightDateInputWrapper: {
    height: "56px",
    width: "80%",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    boxSizing: "border-box",
    [`& label`]: {
      paddingLeft: "8px",
      paddingTop: "8px"
    },
    [`& div.MuiInput-formControl`]: {
      paddingLeft: "8px",
      top: "8px"
    },
    [`& div.MuiInput-underline:before`]: {
      borderBottom: "none !important"
    }
  }
}));

export default function FlightSegment() {
  const classes = useStyles({});

  const [selectedDate, setSelectedDate] = useState(
    new Date("2014-08-18T21:11:54")
  );
  const [dateOpen, setDateOpen] = useState(false);

  const handleDateChange = (date: any) => {
    setDateOpen(false);
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className={classes.segmentTitle}>Flight 1</div>
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
            label="Date picker inline"
            open={dateOpen}
            onOpen={() => setDateOpen(true)}
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
