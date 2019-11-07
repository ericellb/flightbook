<?php

namespace App;

class SegmentOptions
{
    private $sort_type;
    private $filter_airline;

    public function __construct($sort_type, $filter_airline)
    {
        // Filter / Validate sort type to approved types
        if ($sort_type !== 'price ' && $sort_type !== 'departure_time' && $sort_type !== 'total_time') {
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
