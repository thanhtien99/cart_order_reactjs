import axios from 'axios';


const apiConfig = axios.create({
    baseURL: 'http://10.0.2.2:3001/',
    withCredentials: true,
});

export default apiConfig;