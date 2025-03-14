import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://10.0.2.2:3001/';

const socket = io(URL);
export default socket;