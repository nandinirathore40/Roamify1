import axios from 'axios';

const API = axios.create({
    baseURL: 'https://flight-backend-auda.onrender.com/api/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default API;