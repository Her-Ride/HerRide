import {useEffect, useState} from 'react';

interface Ride {
  id: number;
  from: string;
  to: string;
  time: string;
}   


function App() {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    fetch('/api/rides')
      .then((response) => response.json())
      .then((data) => setRides(data))
      .catch((error) => console.error('Error fetching rides:', error));
  }, []);
  return (
    <>
   <div style = { { padding: "1rem"}}>
      <h1>HerRide Rides</h1>
      <h2>Availvable Rides</h2>
      <ul>
        {rides.map((ride) => (
          <li key={ride.id}>
            {ride.from} to {ride.to} at {ride.time}
          </li>
        ))}
      </ul>
      </div>
    </>
  )
}

export default App
