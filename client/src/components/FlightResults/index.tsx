import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../reducers";
import { FlightData } from "../../actions/types";
import { makeStyles, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    padding: "24px",
    background: "#fff",
    width: "500px"
  }
}));

export default function FlightResults() {
  const classes = useStyles({});
  const tripsList = useSelector((state: StoreState) => state.tripStore.trips);

  return (
    <div className={classes.container}>
      <List>
        {tripsList.map((trip, i) => {
          return trip.map((flight: FlightData, j) => {
            return (
              <Fragment>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>{flight.airline_code}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      "Depart from : " +
                      flight.departure_airport +
                      " @ " +
                      flight.departure_time +
                      " on " +
                      flight.departure_date +
                      " $" +
                      flight.price
                    }
                    secondary={
                      "Arrive at : " +
                      flight.arrival_airport +
                      " @ " +
                      flight.arrival_time +
                      " on " +
                      flight.arrival_date +
                      " duration : " +
                      flight.flight_duration
                    }
                  ></ListItemText>
                </ListItem>
                {j === trip.length - 1 && i !== tripsList.length - 1 ? <Divider /> : null}
              </Fragment>
            );
          });
        })}
      </List>
    </div>
  );
}
