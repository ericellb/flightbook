export enum ACTION {
  UPDATE_FLIGHTS
}

export type FlightActionTypes = UpdateFlightsAction;

/* Action Types */
export type UpdateFlightsAction = {
  type: ACTION.UPDATE_FLIGHTS;
  payload: FlightData[][];
};

/* Interfaces for Data coming into Action Creators */

export interface FlightData {
  id: number;
  departure_airport: string;
  departure_time: string;
  arrival_airport: string;
  arrival_time: string;
  airline_code: string;
  airline_number: string;
  price: string;
  departure_date: string;
}
