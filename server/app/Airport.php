<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Airport extends Model
{
    // Disable timestamps for seeding
    public $timestamps = false;

    // Returns array of airports in vacinity of given airport
    public static function getVacinityOf($airport_code)
    {

        // Get long/lat of given airport
        $airportCoords = Airport::select('latitude', 'longitude')
            ->where('code', strtoupper($airport_code))
            ->firstOrFail();

        // Calculate new long/lat within 10km
        $latRange = calcLatRange($airportCoords->latitude);
        $lngRange = calcLongRange($airportCoords->longitude, $airportCoords->latitude);

        return Airport::select('code')->whereBetween('latitude', [$latRange[0], $latRange[1]])
            ->whereBetween('longitude', [$lngRange[0], $lngRange[1]])
            ->get();

    }
}

function calcLatRange($latitude)
{
    // Distance and radius in kilometers
    $radius_earth = 6378;
    $distance_radius = 10;

    $latMin = $latitude - ($distance_radius / $radius_earth) * (180 / pi());
    $latMax = $latitude + ($distance_radius / $radius_earth) * (180 / pi());
    return array($latMin, $latMax);
}

function calcLongRange($longitude, $latitude)
{
    // Distance and radius in kilometers
    $radius_earth = 6378;
    $distance_radius = 10;

    $lngMin = $longitude - ($distance_radius / $radius_earth) * (180 / pi()) / cos($latitude * pi() / 180);
    $lngMax = $longitude + ($distance_radius / $radius_earth) * (180 / pi()) / cos($latitude * pi() / 180);
    return array($lngMin, $lngMax);
}
