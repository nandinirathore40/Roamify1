import { useEffect, useState } from 'react';
import API from '../api';

const FlightList = () => {
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        API.get('flights/')
            .then(res => setFlights(res.data))
            .catch(err => console.error("Error fetching flights:", err));
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Available Flights</h2>
            <ul>
                {flights.map(flight => (
                    <li key={flight.id}>
                        {flight.flight_number} : {flight.origin} to {flight.destination} - ₹{flight.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FlightList;