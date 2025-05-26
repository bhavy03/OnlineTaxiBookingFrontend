export type Suggestion = {
  place_id: string;
  osm_id: string;
  osm_type: string;
  licence: string;
  lat: string;
  lon: string;
  boundingbox: string[];
  class: string;
  type: string;
  display_name: string;
  display_place: string;
  display_address: string;
  address: {
    name: string;
    road: string;
    suburb: string;
    city: string;
    county: string;
    state: string;
    postcode: string;
    country: string;
    country_code: string;
  };
};

// {
//     "place_id": "320860472392",
//     "osm_id": "1946937441",
//     "osm_type": "node",
//     "licence": "https://locationiq.com/attribution",
//     "lat": "26.9291996",
//     "lon": "75.703282",
//     "boundingbox": [
//       "26.9241996",
//       "26.9341996",
//       "75.698282",
//       "75.708282"
//     ],
//     "class": "railway",
//     "type": "station",
//     "display_name": "Kanakpura, Kanakura Railway Station Road, Kanak Pura, Jaipur, Jaipur Tehsil, Rajasthan, 302001, India",
//     "display_place": "Kanakpura",
//     "display_address": "Kanakura Railway Station Road, Kanak Pura, Jaipur, Jaipur Tehsil, Rajasthan, 302001, India",
//     "address": {
//       "name": "Kanakpura",
//       "road": "Kanakura Railway Station Road",
//       "suburb": "Kanak Pura",
//       "city": "Jaipur",
//       "county": "Jaipur Tehsil",
//       "state": "Rajasthan",
//       "postcode": "302001",
//       "country": "India",
//       "country_code": "in"
//     }
//   },
