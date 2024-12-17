import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './layout/home';
import Login from './auth/login';
import Register from './auth/register';


function PathURL(props) {
    return (
        <Routes>
            <Route exact path="/" Component={Home} />
            <Route path="/login" Component={Login}/>
            <Route path="/register" Component={Register}/>
        </Routes>
    );
}

export default PathURL;