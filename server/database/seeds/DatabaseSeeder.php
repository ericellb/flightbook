<?php
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(FlightTableSeeder::class);
        $this->call(AirportTableSeeder::class);
        $this->call(AirlineTableSeeder::class);
    }
}
