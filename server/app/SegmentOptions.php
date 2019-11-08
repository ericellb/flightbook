<?php

namespace App;

/*
SegmentOptions describe sorting and filters applied to SegmentFlights
 */
class SegmentOptions
{
    private $sort_type;
    private $filter_airline;

    public function __construct($sort_type, $filter_airline)
    {
        if ($sort_type == null) {
            $sort_type = 'price';
        }
        $this->sort_type = $sort_type;
        $this->filter_airline = $filter_airline;
    }

    public function getSortType()
    {
        return $this->sort_type;
    }

    public function getFilterAirline()
    {
        return $this->filter_airline;
    }
}
