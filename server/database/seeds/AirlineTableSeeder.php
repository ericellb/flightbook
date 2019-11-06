<?php

use App\Airline;
use Illuminate\Database\Seeder;

class AirlineTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('airlines')->delete();
        $airlinesJson = File::get("database/data/airlines.json");
        $airlines = json_decode($airlinesJson);
        foreach ($airlines as $airline) {
            Airline::create(array(
                'code' => $airline->code,
                'name' => $airline->name,
            ));
        }
    }
}
