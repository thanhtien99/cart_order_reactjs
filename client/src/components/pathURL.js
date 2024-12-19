import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./layout/home";
import Login from "./auth/login";
import Register from "./auth/register";
import Profile from "./profile";
import PrivateRouter from "../protecting_router/private_router";
import UnPrivateRouter from "../protecting_router/unprivate_router";

function PathURL(props) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <UnPrivateRouter>
            <Login />
          </UnPrivateRouter>
        }
      />
      <Route
        path="/register"
        element={
          <UnPrivateRouter>
            <Register />
          </UnPrivateRouter>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRouter>
            <Profile />
          </PrivateRouter>
        }
      />
    </Routes>
  );
}

export default PathURL;
