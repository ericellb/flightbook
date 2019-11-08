<?php

namespace Tests\Feature;

use Tests\TestCase;

class AutoSuggestTest extends TestCase
{
    /**
     * Test suggestion by airport code
     *
     * @return void
     */
    public function test_can_auto_suggest_airport_code()
    {
        $searchQuery = ['query' => 'YU'];
        $response = $this->json('GET', 'api/suggest', $searchQuery);
        $this->assertAutoSuggestJson($response);
    }

    /**
     * Test suggestion by airport name
     *
     * @return void
     */
    public function test_can_auto_suggest_airport_name()
    {
        $searchQuery = ['query' => 'Pierre'];
        $response = $this->json('GET', 'api/suggest', $searchQuery);
        $this->assertAutoSuggestJson($response);
    }

    /**
     * Test suggestion by airport name
     *
     * @return void
     */
    public function test_can_auto_suggest_airport_city()
    {
        $searchQuery = ['query' => 'Montr'];
        $response = $this->json('GET', 'api/suggest', $searchQuery);
        $this->assertAutoSuggestJson($response);
    }

    /**
     * Test suggestion by airport name
     *
     * @return void
     */
    public function test_can_auto_suggest_422_no_query()
    {
        $searchQuery = [];
        $response = $this->json('GET', 'api/suggest', $searchQuery);
        $response->assertStatus(422);

    }

    private function assertAutoSuggestJson($response)
    {
        return $response->assertJson([
            [
                'code' => 'YUL',
                'name' => 'Pierre Elliott Trudeau International',
                'city' => 'Montreal',
            ],
        ]);
    }
}
