# Flightbook

> Trip building and navigating web service with frontend allowing you to choose Oneway, Roundtrip and Multi city trips.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes

### Prerequisites

What things you need to install the software

```
php7.2-sqlite
npm
composer
```

If making requests from postman / insomnia make sure to supply add two headers

```
Accept: application/json
Content-Type: application/json
```

### Installing

Follow these instructions to get the laravel service setup

```
git clone https://github.com/ericellb/flightbook.git
cd flightbook
cd server
./setup.sh
php artisan serve
```

If everything works correctly you should be able to open your browser at the following url and get a JSON response

```
http://127.0.0.1:8000/api/search?type=oneway&seg0_from=YUL&seg0_to=YVR&seg0_date=Nov%2016%202019
```

## Running the tests

Run phpunit

```
vendor/bin/phpunit
```

### Break down into end to end tests

**Request a Oneway trip**

- Sets the appropriate URL params and validates JSON Sctructure

**Request a Roundtrip**

- Sets the appropriate URL params and validates JSON Sctructure

**Request a Multi trip**

- Sets the appropriate URL params and validates JSON Sctructure

## Features

Implemented

- [x] Use data storage(s) provisioned within the environment
- [x] Implement automated software tests
- [x] Allow flights to be restricted to a preferred airline
- [x] Sort trip listings
- [x] Support open-jaw trips, a pair of one-ways getting from A to B then from C to A
- [x] Support multi-city trips, one-ways (up to 5) from A to B, B to C, C to D, etc.

Todo

- [ ] Deploy the application online to ease the review process
- [ ] Scale beyond sample data (see below)
- [ ] Document Web Services
- [ ] Paginate trip listings
- [ ] Allow flights departing and/or arriving in the vicinity of requested locations

## API Documentation

### Build Trip

Returns JSON with Trips including Flights for each Segment

- **URL**

  /api/search

- **Method:**

  `GET`

- **URL Params**

  **Required:**

  `seg0_from=[string|max:3]`

  `seg0_to=[string|max:3]`

  `seg0_date=[date]`

  `type=[oneway | roundtrip | multix] where x is number of segments`

  **Optional:**

  `sort=[price | departure_time | total_time]`

  `airline=[string|max:3]`

* **Example Success Response:**

  - **Code:** 200 <br />
    **Content:** `{ "trips": [ [ { "id": 1, "departure_airport": "YUL", "departure_time": "13:35", "arrival_airport": "YVR", "arrival_time": "19:05", "airline_code": "AC", "airline_number": "301", "price": "273.23", "departure_date": "Nov 16 2019" } ] ] }`

- **Example Error Response:**

  - **Code:** 422 BAD REQUEST <br />
    **Content:** `{ "message": "The given data was invalid.", "errors": { "seg0_date": [ "The seg0 date field is required." ] } }`

* **Sample Call:**

  ```javascript
    axios.post('http://127.0.0.1:8000/api/search?type=oneway&seg0_from=YUL&seg0_to=YVR&segd0_date=Nov 16 2019')
    .then((res) => {
    	console.log(res);
    }
  ```

## License

TO ADD
