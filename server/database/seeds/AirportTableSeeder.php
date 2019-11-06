<?php

use App\Airport;
use Illuminate\Database\Seeder;

class AirportTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('airports')->delete();
        $airportsJson = File::get("database/data/airports.json");
        $airports = json_decode($airportsJson);
        foreach ($airports as $airport) {
            Airport::create(array(
                'code' => $airport->code,
                'city_code' => $airport->city_code,
                'name' => $airport->name,
                'city' => $airport->city,
                'country_code' => $airport->country_code,
                'region_code' => $airport->region_code,
                'latitude' => $airport->latitude,
                'longitude' => $airport->longitude,
                'timezone' => $airport->timezone,
            ));
        }
    }
}
