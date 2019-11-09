import { ACTION, FlightActionTypes, FlightData } from "../actions/types";

export interface TripStore {
  trips: FlightData[];
}

const initialState = {
  trips: []
};

export const flightsReducer = (
  state: TripStore = initialState,
  action: FlightActionTypes
): TripStore => {
  switch (action.type) {
    case ACTION.UPDATE_FLIGHTS:
      return { ...state, trips: action.payload };
    default:
      return state;
  }
};
