import React from "react";
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <div className="header_top">
      <nav className="navbar navbar-expand-lg navbar-light navbar-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <i className="main_logo"></i>
          </a>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <form className="d-flex me-auto form_search">
                <button className="btn_search" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                </button>
              <input
                className="form-control me-2 input_search"
                type="search"
                placeholder="Bạn tìm gì..."
                aria-label="Search"
              />
            </form>
            <ul className="navbar-nav">
              <li className="nav-item me-2">
                <a className="nav-link nav-link-custom" aria-current="page" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                </a>
              </li>
              <li className="nav-item me-2">
                <NavLink className="nav-link nav-link-custom" aria-current="page" to="/login">
                  Đăng nhập
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" aria-current="page" to="/register">
                  Đăng ký
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
