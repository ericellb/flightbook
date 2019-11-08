<?php

namespace App\Http\Controllers;

use App\Http\Requests\TripBuilderRequest;
use App\Segment;
use App\SegmentFlights;
use App\SegmentOptions;
use Illuminate\Http\Request;

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

        $request->validated();

        // Get trip type and calculate number of segments
        $type = $request->type;
        $number_segments = $this->calculateSegments($type);

        // Build trips depending on number of segements
        for ($i = 0; $i < $number_segments; $i++) {
            $segments[$i] = $this->buildSegment($request, $i);
        }

        // Build segment options, same for all segments
        $segmentsOptions = $this->buildSegmentOptions($request);

        // Iterate over segments get flights for each segment
        $segmentFlights = [];
        foreach ($segments as $i => $segment) {
            $segmentFlights[$i] = (new SegmentFlights($segment, $segmentsOptions))->getFlights();
        }

        $tripCombinations = $this->buildTripCombinations($segmentFlights);
        $tripCombinations = $this->filterCombatibleFlights($tripCombinations);

        return ['trips' => $tripCombinations];

    }

    // Carterian Product Solution taken from stackoverflow
    // https://stackoverflow.com/questions/8567082/how-to-generate-in-php-all-combinations-of-items-in-multiple-arrays
    private function buildTripCombinations($arrays)
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

    private function filterCombatibleFlights($trips)
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
    private function calculateSegments($type)
    {
        $number_segments = 0;
        if ($type === 'oneway') {
            $number_segments = 1;
        } else if ($type === 'roundtrip') {
            $number_segments = 2;
        } else if (strpos($type, 'multi') !== false) {
            $number_segments = substr($type, 5);
            if ($number_segments > 5) {
                $number_segments = 5;
            }
        }
        return $number_segments;
    }

    // Builds a segment Object
    private function buildSegment(Request $request, $i)
    {
        ${'seg' . $i . '_from'} = $request->{'seg' . $i . '_from'};
        ${'seg' . $i . '_to'} = $request->{'seg' . $i . '_to'};
        ${'seg' . $i . '_date'} = $request->{'seg' . $i . '_date'};
        return new Segment(${'seg' . $i . '_from'}, ${'seg' . $i . '_to'}, ${'seg' . $i . '_date'});
    }

    private function buildSegmentOptions(Request $request)
    {
        $sort_type = $request->sort;
        $filter_airline = $request->airline;
        return new SegmentOptions($sort_type, $filter_airline);
    }
}
