<?php

use App\Flight;
use Illuminate\Database\Seeder;

class FlightTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('flights')->delete();
        $flightsJson = File::get("database/data/flights.json");
        $flights = json_decode($flightsJson);
        foreach ($flights as $flight) {
            Flight::create(array(
                'airline_code' => $flight->airline,
                'airline_number' => $flight->number,
                'departure_airport' => $flight->departure_airport,
                'departure_time' => $flight->departure_time,
                'arrival_airport' => $flight->arrival_airport,
                'arrival_time' => $flight->arrival_time,
                'price' => $flight->price,
            ));
        }
    }
}
