import React from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import logo from './logo.svg';
import './App.css';
import birdsData from "./data/data1.json"
function App() {

console.log(birdsData)


  
  return (
    
    <MapContainer center={[55.250000 , -2.0005590]} zoom={7} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {birdsData.map(bird => (
        <Marker
          key = {bird.speciesCode}
          position={[bird.lat, bird.lng]}>
          
        <Popup position = {[bird.lat, bird.lng]}>
            <div>
              <h4>{"Species: " + bird.comName}</h4>
              <p>{"Count of bird in area: " + bird.howMany}</p>
              <p>{"Location: " + bird.locName}</p>
        </div>
        </Popup>

        </Marker>
      ))}

    </MapContainer>
  );
}

export default App;
