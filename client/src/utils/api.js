import axios from 'axios';


const apiConfig = axios.create({
    baseURL: 'http://localhost:3001/',
    withCredentials: true,
});

export default apiConfig;