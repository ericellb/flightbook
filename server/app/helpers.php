<?php

function isSameDayFlights($v, $t)
{
    return $v->departure_date === $t->departure_date;
}

function arrivesBefore($v, $t)
{
    return $v->arrival_time < $t->departure_time;
}
