import { ACTION, FlightData, UpdateFlightsAction } from "./types";

// On sign in
export const updateFlights = (flights: FlightData[][]): UpdateFlightsAction => ({
  type: ACTION.UPDATE_FLIGHTS,
  payload: flights
});
