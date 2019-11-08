<?php

namespace App;

/*
Segment describes a leg of a trip
It includes an Origin, Destination and a Date
 */
class Segment
{
    private $seg_from;
    private $seg_to;
    private $seg_date;

    public function __construct($seg_from, $seg_to, $seg_date)
    {
        $this->seg_from = $seg_from;
        $this->seg_to = $seg_to;
        $this->seg_date = $seg_date;
    }

    public function getFrom()
    {
        return $this->seg_from;
    }

    public function getTo()
    {
        return $this->seg_to;
    }

    public function getDate()
    {
        return $this->seg_date;
    }
}
