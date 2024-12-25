import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./layout/home";
import Login from "./auth/login";
import Register from "./auth/register";
import Profile from "./profile";
import PrivateRouter from "../protecting_router/private_router";
import UnPrivateRouter from "../protecting_router/unprivate_router";
import Cart from "./cart/cart";
import Order from "./cart/order";
import ProductDetail from "./product/product_detail";

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
      <Route path="/cart" element={<Cart />} />
      <Route path="/order" element={<Order />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
}

export default PathURL;
