<?php

namespace Tests\Feature;

use Tests\TestCase;

class TripBuilderTest extends TestCase
{
    /**
     * Tests if we can request a one way trip by validating json structure
     *
     * @return void
     */
    public function test_a_user_can_request_a_oneway()
    {
        $this->withoutExceptionHandling();
        $searchQuery = ['type' => 'oneway', 'seg0_from' => 'YUL', 'seg0_to' => 'YVR', 'seg0_date' => 'Nov-15-2019'];
        $response = $this->json('GET', 'api/search', $searchQuery);
        $this->assertTripJsonStructure($response);
    }

    /**
     * Tests if we can request a round trip by validating json structure
     *
     * @return void
     */
    public function test_a_user_can_request_a_roundtrip()
    {
        $this->withoutExceptionHandling();
        $searchQuery = ['type' => 'roundtrip',
            'seg0_from' => 'YUL', 'seg0_to' => 'YVR', 'seg0_date' => 'Nov-15-2019',
            'seg1_from' => 'YVR', 'seg1_to' => "YUL", 'seg1_date' => 'Nov-16-2019'];

        $response = $this->json('GET', 'api/search', $searchQuery);
        $this->assertTripJsonStructure($response);
    }

    /**
     * Tests if we can request a round trip by validating json structure
     *
     * @return void
     */
    public function test_a_user_can_request_a_multi_trip()
    {
        $this->withoutExceptionHandling();
        $searchQuery = ['type' => 'roundtrip',
            'seg0_from' => 'YUL', 'seg0_to' => 'YVR', 'seg0_date' => 'Nov-15-2019',
            'seg1_from' => 'YVR', 'seg1_to' => "YUL", 'seg1_date' => 'Nov-16-2019',
            'seg2_from' => 'YUL', 'seg2_to' => "YVR", 'seg2_date' => 'Nov-17-2019'];

        $response = $this->json('GET', 'api/search', $searchQuery);
        $this->assertTripJsonStructure($response);
    }

    /**
     * Tests if we can get flights departing in vacinity
     * Only gets vacinity airports if departing from an airport with no flights at that time
     *
     * @return void
     */
    public function test_a_user_can_request_a_trip_in_vacinity()
    {
        $this->withoutExceptionHandling();
        $searchQuery = ['type' => 'oneway', 'seg0_from' => 'VTS', 'seg0_to' => 'YVR', 'seg0_date' => 'Nov-15-2019'];
        $response = $this->json('GET', 'api/search', $searchQuery);
        $this->assertTripJsonStructure($response);
    }

    private function assertTripJsonStructure($response)
    {
        return $response->assertJsonStructure([
            'trips' => [
                '*' => [
                    '*' => [
                        'id',
                        'departure_airport',
                        'departure_time',
                        'arrival_airport',
                        'arrival_time',
                        'airline_code',
                        'airline_number',
                        'price',
                        'departure_date',
                    ],
                ],
            ],
        ]);
    }

}
