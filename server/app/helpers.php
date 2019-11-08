<?php

function isSameDayFlights($segment1, $segment2)
{
    return $segment1->departure_date === $segment2->departure_date;
}

function arrivesBefore($segment1, $segment2)
{
    return $segment1->arrival_time < $segment2->departure_time;
}
