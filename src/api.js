import axios from 'axios';

const API = axios.create({
    // Yahan localhost ki jagah apna Render URL daal do
    //baseURL: 'https://flight-backend-auda.onrender.com/api/', 
    baseURL: 'http://127.0.0.1:8000/api/',
});

export default API;