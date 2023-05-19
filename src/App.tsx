import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Popup, Polyline } from 'react-leaflet'
import './App.css';
import axios from 'axios';
import polyline from '@mapbox/polyline'
function App() {

  interface Activity {
    activityPositions: any;
    activityName: string;
    activityElevation: number; 
    activityHeart: any;
    activityDate: any;
  }


const [actvities, setActivities] = useState<Activity[]>([]);
// console.log(birdsData)

// Client ID and Client Secret
// Client id = 107680 , Client Secret = a7e1a410d3f239360a161d7f955826fbef216eb3
// Authorisation code = http://www.strava.com/oauth/authorize?client_id=107680&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read
// 46120f534780368ac258d8d4807b4705d8d464a4
// http://www.strava.com/oauth/authorize?client_id=107680&client_secret=a7e1a410d3f239360a161d7f955826fbef216eb3&code=30bbfdcb93801d0519dda668279d1ac35c7a6de6=authorization_code
//      "refresh_token": "26c607f0e8239a7524c3d923c4298e2110999890",
// "access_token": "81816a12e0e5b9c1ea9e7cb8600a507e4c82b2cf",
// https://www.strava.com/api/v3/athelete/activities?access_token=1431101d07c8c533b2e4e2abe0a334d6d44e9556
  
  const clientID = "107680";
  const clientSecret = "a7e1a410d3f239360a161d7f955826fbef216eb3";
  const refreshToken = "ee474cd7f914641895f3b42e11a353fa83cdbb2f"
  const auth_link = "https://www.strava.com/oauth/token"
  const activities_link = `https://www.strava.com/api/v3/athlete/activities`

  useEffect(() => {
    async function fetchData() {
      const stravaAuthResponse = await axios.all([
        axios.post(`${auth_link}?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`)
      ]);
      
      const stravaActivityResponse = await axios.get(`${activities_link}?access_token=${stravaAuthResponse[0].data.access_token}`);
      
      console.log(polyline.decode(stravaActivityResponse.data[0].map.summary_polyline))
      console.log(stravaActivityResponse.data[0])
      const polylines = [];

      for (let i = 0; i < stravaActivityResponse.data.length; i += 1) {
        const activity_polyline = stravaActivityResponse.data[i].map.summary_polyline;
        const activity_name = stravaActivityResponse.data[i].name;
        const activity_elevation = stravaActivityResponse.data[i].total_elevation_gain;
        const activity_heart = stravaActivityResponse.data[i].average_heartrate;
        const activity_date = stravaActivityResponse.data[i].start_date;
        polylines.push({activityPositions: polyline.decode(activity_polyline), activityName: activity_name, activityElevation: activity_elevation, activityHeart: activity_heart, activityDate: activity_date });
      }
      console.log(polylines)
      
      setActivities(polylines);

      // polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
    }

    fetchData();
  }, []);
  
  return (
    <MapContainer center={[55.250000 , -2.0005590]} zoom={7} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {actvities.map((activity, i) => (
        <Polyline key = {i} positions={activity.activityPositions}>
          <Popup>
            <div>
              <h2>{"Name: " + activity.activityName}</h2>
              <p>{activity.activityElevation}</p>
              <p>{activity.activityHeart}</p>
              <p>{activity.activityDate}</p>
            </div>
          </Popup>
       

        </Polyline>
        
      ))}

    </MapContainer>
    
  );
}

export default App;
