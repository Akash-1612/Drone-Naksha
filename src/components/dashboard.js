/* global google */

import "./dashboard.css";
import { useState, useRef, useEffect } from "react";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, } from '@react-google-maps/api';

const center = {
  lat: 28.7565,
  lng: 77.756578,
};

function Dashboard() {



  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState((null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [dronePosition, setDronePosition] = useState(center);

  const pointOne = useRef();
  const pointTwo = useRef();

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  async function calculateRoute() {
    if (pointOne.current.value === '' || pointTwo.current.value === '') {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: pointOne.current.value,
      destination: pointTwo.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results);
  }

  return (
    <div className="dashboard">

      <div className="dashboard-head">
        <div className="dashboard-header">
          <h1>Drone Naksha 🗺️</h1>
        </div>

        <div className="dashboard-body">
          <div className="lone">
            <label> 📌Point 1:</label>
            <Autocomplete>
              <input type="text" placeholder="Latitude, Longtiude" ref={pointOne} />
            </Autocomplete>
          </div>

          <div className="ltwo">
            <label> 📌Point 2:</label>
            <Autocomplete>
              <input type="text" placeholder="Latitude, Longitude" ref={pointTwo} />
            </Autocomplete>
          </div>
        </div>

        <div className="btn">
          <button type="submit" onClick={calculateRoute}> Go </button>
        </div>
      </div>

      <div className="mapBox">
        <GoogleMap center={center} zoom={11} mapContainerStyle={{ width: '900px', height: '400px', borderRadius: '32px',}}
          options={{ zoomControl: false, streetViewControl: false, mapTypeControl: false, ullscreenControl: false, }}
          onLoad={map => setMap(map)}>
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )} 
          <Marker position={dronePosition} icon={{ url: 'https://i.imgur.com/7teZKif.png', scaledSize: new window.google.maps.Size(50, 50) }} />
          </GoogleMap>
      </div>

    </div>


  );
}

export default Dashboard;