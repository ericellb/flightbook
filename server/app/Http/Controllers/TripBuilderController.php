<?php

namespace App\Http\Controllers;

use App\Http\Requests\TripBuilderRequest;
use App\Segment;
use App\SegmentFlights;
use App\SegmentOptions;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TripBuilderController extends Controller
{
    /*
    Required
    type=[oneway | roundtrip | multi]

    Depending on number of segments 0-4
    seg0_from=[string]
    seg0_to=[string]
    seg0_date=[string]
    ...
    seg4_from=[string]
    seg4_to=[string]
    seg4_date=[string]

    Optional
    sort=[price | departure_time | total_time]
    ariline=[string]

     */
    public function build(TripBuilderRequest $request)
    {

        // Validate request fields
        $request->validated();

        // Get trip type and calculate number of segments
        $type = $request->type;
        $number_segments = $this->getNumberSegments($type);

        // Create segment options, same for all segments
        $segmentsOptions = new SegmentOptions($request->sort_type, $request->filter_airline);

        // Create the segments
        for ($i = 0; $i < $number_segments; $i++) {
            $segments[$i] = $this->createSegment($request, $i);
        }

        // Create list of Flights for each Segment
        $segmentFlights = [];
        foreach ($segments as $i => $segment) {
            $segmentFlights[$i] = (new SegmentFlights($segment, $segmentsOptions))->getFlights();

            // If no flights found for a given segment, need to choose new airports
            if ($segmentFlights[$i]->isEmpty()) {
                return new Response('No flights found in vacinity, try another airport', 404);
            }
        }

        // Build and filter trip combinations
        $tripCombinations = $this->crossJoinTripCombinations($segmentFlights);
        $tripCombinations = $this->filterTripCombinations($tripCombinations);

        return ['trips' => $tripCombinations];

    }

    // Carterian Product Solution taken from stackoverflow
    // https://stackoverflow.com/questions/6311779/finding-cartesian-product-with-php-associative-arrays
    private function crossJoinTripCombinations($arrays)
    {
        $result = array(array());

        foreach ($arrays as $key => $values) {
            $append = array();

            foreach ($result as $product) {
                foreach ($values as $item) {
                    $product[$key] = $item;
                    $append[] = $product;
                }
            }

            $result = $append;
        }

        return $result;
    }

    private function filterTripCombinations($trips)
    {
        $result = [];
        foreach ($trips as $trip) {
            $tmp = [];
            //echo json_encode($trip);
            //echo('   ');
            foreach ($trip as $i => $flight) {
                if ($i <= count($trip) - 1) {
                    if ($i === count($trip) - 1) {
                        array_push($tmp, $flight);
                    } else if (isSameDayFlights($flight, $trip[$i + 1]) && arrivesBefore($flight, $trip[$i + 1]) || !isSameDayFlights($flight, $trip[$i + 1])) {
                        array_push($tmp, $flight);
                    }
                }
            }

            if (count($tmp) === count($trip)) {
                array_push($result, $tmp);
            }
        }
        return $result;
    }

    // Calculates number of segements depending on type of trip
    private function getNumberSegments($type)
    {
        $number_segments = 0;
        if ($type === 'oneway') {
            $number_segments = 1;
        } else if ($type === 'roundtrip') {
            $number_segments = 2;
        } else if (!strpos($type, 'multi')) {
            $number_segments = substr($type, 5);
            if ($number_segments > 5) {
                $number_segments = 5;
            }
        }
        return $number_segments;
    }

    // Builds a segment Object
    private function createSegment(Request $request, $i)
    {
        ${'seg' . $i . '_from'} = $request->{'seg' . $i . '_from'};
        ${'seg' . $i . '_to'} = $request->{'seg' . $i . '_to'};
        ${'seg' . $i . '_date'} = $request->{'seg' . $i . '_date'};
        return new Segment(${'seg' . $i . '_from'}, ${'seg' . $i . '_to'}, ${'seg' . $i . '_date'});
    }
}
