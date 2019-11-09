import { flightsReducer, TripStore } from "./tripsReducer";
import { combineReducers } from "redux";

export interface StoreState {
  tripStore: TripStore;
}

export default combineReducers<StoreState>({
  tripStore: flightsReducer
});
