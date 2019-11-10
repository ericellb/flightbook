import React, { useState, Fragment, createRef } from "react";
import { makeStyles, TextField, Popper, Paper, List, ListItem } from "@material-ui/core";
import { AirplanemodeActive, DateRange } from "@material-ui/icons";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment, { Moment } from "moment";
import { Segment } from ".";
import axios from "../AxiosClient";

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
  },
  popperBar: {
    top: "2px",
    width: "410px",
    zIndex: 200,
    fontSize: "14px"
  },
  popperPaper: {
    padding: "1em"
  },
  selected: {
    backgroundColor: "rgba(0, 0, 0, 0.08)"
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

  // Controls the datepicker open / close
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  // AutoSuggest state
  const [predictions, setPredictions] = useState<any[]>();
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);

  // Handles clicking on a prediction
  const handlePredictionSelect = (prediction: any) => {
    setPopperOpen(false);
    prediction = prediction.code + " - " + prediction.name + `(${prediction.city})`;
    handleSegmentChange(anchorEl.name, prediction, null);
  };

  // AutoSuggest Request and set preditions
  const handleAutoSuggest = async (value: string, e: any) => {
    setAnchorEl(e);
    setPopperOpen(true);
    try {
      let res = await axios.get(`/api/suggest?query=${value}`);
      console.log(res.data);
      setPredictions(res.data);
    } catch {}
  };

  // Handles ArrowDown + Up to Naviagate Predicitons list
  const handleArrowNavigate = (e: any) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      let tempSelected = selectedPrediction;
      if (tempSelected === null) {
        tempSelected = -1;
      }

      if (e.key === "ArrowDown") {
        tempSelected++;
      } else if (e.key === "ArrowUp") {
        tempSelected--;
      }

      if (tempSelected < 0) {
        tempSelected = 0;
      } else if (predictions && tempSelected > predictions.length - 1) {
        tempSelected = predictions.length - 1;
      }

      setSelectedPrediction(tempSelected);
    } else if (e.key === "Enter") {
      if (predictions && selectedPrediction !== null) {
        handlePredictionSelect(predictions[selectedPrediction]);
      }
    }
  };

  // Handles changing date using DatePicker
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

    date = moment(date).format("M/D/Y");
    handleSegmentChange(property, date, null);
  };

  // Handles changing a specific property in our Segment state
  const handleSegmentChange = (property: string, value: string | Date, e: any) => {
    // Change Segment state
    props.setSegment((segment: any) =>
      segment.map((item: any, index: any) => (index === props.segmentNumber ? { ...item, [property]: value } : item))
    );

    // Call AutoSuggest service to show options
    if (e !== null) {
      handleAutoSuggest(value.toString(), e);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {props.type === "multi" ? <div className={classes.segmentTitle}>Flight {props.segmentNumber + 1}</div> : null}
      <div className={classes.flightSegment} onKeyDown={e => handleArrowNavigate(e)}>
        <div className={classes.flightInputWrapper}>
          <div className={classes.flightInputLabel}>
            <AirplanemodeActive className={classes.flightAirportLabelFromIcon} />
            From
          </div>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Leaving from"
            className={classes.flightAirportInput}
            value={props.segment.seg_from}
            name="seg_from"
            autoComplete="off"
            onChange={e => handleSegmentChange("seg_from", e.target.value, e.target)}
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
            name="seg_to"
            autoComplete="off"
            onChange={e => handleSegmentChange("seg_to", e.target.value, e.target)}
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
              <div className={classes.flightInputLabel} style={{ marginLeft: "8px" }}>
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
        <Popper open={popperOpen} anchorEl={anchorEl} placement="bottom-start" className={classes.popperBar}>
          <Paper className={classes.popperPaper}>
            <List>
              {predictions &&
                predictions.map((prediction, i) => {
                  return (
                    <ListItem
                      button
                      onClick={() => handlePredictionSelect(prediction)}
                      className={i === selectedPrediction ? classes.selected : ""}
                    >
                      {prediction.code + " - " + prediction.name + ` (${prediction.city})`}
                    </ListItem>
                  );
                })}
            </List>
          </Paper>
        </Popper>
      </div>
    </MuiPickersUtilsProvider>
  );
}
