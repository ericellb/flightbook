<?php

namespace App;

use App\Flight;
use Illuminate\Support\Facades\DB;

class SegmentFlights
{
    /*
    @Function Input
    segment=[Segment]
    segmentOptions=[SegmentOptions]

    @return array of flights
     */
    private $flights = [];

    public function __construct(Segment $segment, SegmentOptions $segmentOptions)
    {
        $departure_airport = $segment->getFrom();
        $arrival_airport = $segment->getTo();
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
        $departure_time_min = date("H:i:s", $departure_time_min);
        $departure_time_max = date("H:i:s", strtotime("tomorrow", $begin_of_departure_day) - 1);

        if ($this->isValidDepartureDate($begin_of_departure_day)) {
            // Get all flights that match our criteria
            $this->flights = Flight::where('departure_airport', $departure_airport)
                ->where('arrival_airport', $arrival_airport)
                ->whereBetween('departure_time', [$departure_time_min, $departure_time_max])
                ->when($filter_airline, function ($query, $filter_airline) {
                    $this->filterByAirline($query, $filter_airline);
                })
                ->when($sort_type, function ($query, $sort_type) {
                    $this->sortByType($query, $sort_type);
                })
                ->get();
        }
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

    // Verified if valid departure date ( not greater than 1 year)
    private function isValidDepartureDate($departure_date)
    {
        if ($departure_date < strtotime('+1 year')) {
            return response()->json(['error' => 'Cannot Book flights more than 1 year from today'], 403);
        }
    }
}
