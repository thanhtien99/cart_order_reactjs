import React from 'react';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';


function Home() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = Cookies.get('access_token');
        console.log('Token from cookies:', token);
        setToken(token);
    }, []);

    return (
        <div className='container'>
            <h1>Hello World</h1>
            {token ? <p>Token: {token}</p> : <p>No token found</p>}
        </div>
    );
}

export default Home;