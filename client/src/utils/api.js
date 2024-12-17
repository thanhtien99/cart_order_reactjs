import axios from 'axios';

const apiConfig = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default apiConfig;