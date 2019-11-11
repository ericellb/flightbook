<?php

namespace App;

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

    public function __construct(Segment $segment, SegmentOptions $segmentOptions)
    {
        $departure_airport = array($segment->getFrom());
        $arrival_airport = array($segment->getTo());
        $filter_airline = $segmentOptions->getFilterAirline();
        $sort_type = $segmentOptions->getSortType();

        // Calculate current time and end of day time
        $departure_time_min = strtotime($segment->getDate());
        $begin_of_departure_day = strtotime("today", $departure_time_min);

        // If departure day isnt today, set departure_time_min to beggining of that day
        // If not we care about current time as we cant book a flight that already tookoff
        if ($begin_of_departure_day !== strtotime('today')) {
            $departure_time_min = $begin_of_departure_day;
        }

        // Format our time to use for following Flight query
        $departure_times = [];
        array_push($departure_times, date("H:i:s", $departure_time_min));
        array_push($departure_times, date("H:i:s", strtotime("tomorrow", $begin_of_departure_day) - 1));

        //Get all flights that match our criteria
        $this->flights = $this->searchFlights($departure_airport, $arrival_airport, $departure_times, $filter_airline, $sort_type);

        // If no flights found, search in vacinity of airport
        if ($this->flights->isEmpty()) {
            $departure_airports = Airport::getVacinityOf($departure_airport[0]);
            $arrival_airports = Airport::getVacinityOf($arrival_airport[0]);
            $this->flights = $this->searchFlights($departure_airports, $arrival_airports, $departure_times, $filter_airline, $sort_type);
        }

        // Add current date to each flight
        foreach ($this->flights as $flight) {
            $flight->departure_date = $segment->getDate();
        }

    }

    // Searches for flights with input being array of departure/arrival airports and deparrture times
    private function searchFlights($departure_airports, $arrival_airports, $departure_times, $filter_airline, $sort_type)
    {
        return Flight::whereIn('departure_airport', $departure_airports)
            ->whereIn('arrival_airport', $arrival_airports)
            ->whereBetween('departure_time', [$departure_times[0], $departure_times[1]])
            ->when($filter_airline, function ($query, $filter_airline) {
                $this->filterByAirline($query, $filter_airline);
            })
            ->when($sort_type, function ($query, $sort_type) {
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

}
