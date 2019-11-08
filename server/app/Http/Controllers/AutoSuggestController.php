<?php

namespace App\Http\Controllers;

use App\Airport;
use App\Http\Requests\AutoSuggestRequest;

class AutoSuggestController extends Controller
{

    public function search(AutoSuggestRequest $request)
    {

        // Validate request fields
        $request->validated();

        // Get query from string
        $searchQuery = $request->get('query');

        $results = Airport::where('code', 'LIKE', '%' . $searchQuery . '%')
            ->orWhere('city', 'LIKE', '%' . $searchQuery . '%')
            ->orWhere('name', 'LIKE', '%' . $searchQuery . '%')
            ->select('code', 'name', 'city')
            ->take(5)
            ->get();

        return $results;
    }

}
