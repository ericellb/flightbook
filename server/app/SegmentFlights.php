<?php

namespace App;

use DateTime;
use DateTimeZone;
use Illuminate\Support\Facades\DB;

/*
SegmentFlights describe an array of all flights for a given Segmenet
 */
class SegmentFlights
{
    /*
    @Function Input
    segment=[Segment]
    segmentOptions=[SegmentOptions]

    @return array of Flights
     */
    private $flights = [];
    private $departure_airports = [];
    private $arrival_airports = [];
    private $departure_time_min;
    private $departure_time_max;
    private $sort_type;
    private $filter_airline;

    public function __construct(Segment $segment, SegmentOptions $segmentOptions)
    {
        $this->departure_airports = array($segment->getFrom());
        $this->arrival_airports = array($segment->getTo());
        $this->filter_airline = $segmentOptions->getFilterAirline();
        $this->sort_type = $segmentOptions->getSortType();

        // Calculate current time and end of day time
        $departure_time_min = strtotime($segment->getDate());
        $begin_of_departure_day = strtotime("today", $departure_time_min);

        // If departure day isnt today, set departure_time_min to beggining of that day
        // If not we care about current time as we cant book a flight that already tookoff
        if ($begin_of_departure_day !== strtotime('today')) {
            $departure_time_min = $begin_of_departure_day;
        }

        // Set our departure_time min and max
        $this->departure_time_min = date("H:i:s", $departure_time_min);
        $this->departure_time_max = date("H:i:s", strtotime("tomorrow", $begin_of_departure_day) - 1);

        //Get all flights that match our criteria
        $this->flights = $this->searchFlights();

        // If no flights found, search in vacinity of airport
        if ($this->flights->isEmpty()) {
            $this->departure_airports = Airport::getVacinityOf($this->departure_airports[0]);
            $this->arrival_airports = Airport::getVacinityOf($this->arrival_airports[0]);
            $this->flights = $this->searchFlights();
        }

        // Add Departure and Arrival dates to flights
        foreach ($this->flights as $flight) {
            $flight->departure_date = $segment->getDate();
            $flight->arrival_date = $segment->getDate();
            if ($flight->departure_time > $flight->arrival_time) {
                $flight->arrival_date = (new DateTime($segment->getDate() . '+1 day'))->format('M-j-Y');
            }

            $flight->flight_duration = $this->getFlightDuration($flight);
        }

    }

    // Searches for flights with input being array of departure/arrival airports and deparrture times
    private function searchFlights()
    {
        return Flight::whereIn('departure_airport', $this->departure_airports)
            ->whereIn('arrival_airport', $this->arrival_airports)
            ->whereBetween('departure_time', [$this->departure_time_min, $this->departure_time_max])
            ->when($this->filter_airline, function ($query, $filter_airline) {
                $this->filterByAirline($query, $filter_airline);
            })
            ->when($this->sort_type, function ($query, $sort_type) {
                $this->sortByType($query, $sort_type);
            })
            ->get();
    }

    public function getFlights()
    {
        return $this->flights;
    }

    // Helper for Conditional Clause query
    private function sortByType($query, $sort_type)
    {
        if ($sort_type == 'price') {
            return $query->orderBy('price');
        } else if ($sort_type == "departure_time") {
            return $query->orderBy('departure_time');
        } else if ($sort_type == "total_time") {
            return $query->select('flights.*')
                ->orderBy(DB::raw('(arrival_time-departure_time)', 'asc'));
        }
    }

    // Filters by airline code
    private function filterByAirline($query, $filter_airline)
    {
        return $query->where('airline_code', $filter_airline);
    }

    // Gets and returns total flight time, taking timezone into account
    private function getFlightDuration($flight)
    {
        // Find arrival airport calculate time of flight using timezone
        $departingAirport = Airport::select('timezone')->where('code', $flight->departure_airport)->firstOrFail();
        $arrivalAirport = Airport::select('timezone')->where('code', $flight->arrival_airport)->firstOrFail();

        // Accounts for flights going into next day (over night)
        $tmpDepart = $flight->departure_date . ' ' . $flight->departure_time;
        $tmpArrive = $flight->arrival_date . ' ' . $flight->arrival_time;

        $departTime = date('m/d/y H:i:s', strtotime($tmpDepart));
        $arriveTime = date('m/d/y H:i:s', strtotime($tmpArrive));
        $d1 = new DateTime($departTime, new DateTimeZone($departingAirport->timezone));
        $d2 = new DateTime($arriveTime, new DateTimeZone($arrivalAirport->timezone));
        $diff = $d1->diff($d2);
        return $diff->format('%h:%I');
    }

}
