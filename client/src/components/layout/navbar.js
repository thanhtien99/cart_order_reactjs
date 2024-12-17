import React from "react";
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from "../../context/authContext";
import { logout } from "../../services/account";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const {isAuthenticated, setIsAuthenticated, user, setUser} = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout().then((data) =>{
      if(data.success){
        setUser(data.user);
        setIsAuthenticated(false);
      }
      navigate("/login");
    })
  }

  const unauthenticateNavbar = () => {
    return(
      <ul className="navbar-nav">
        <li className="nav-item me-2">
          <a className="nav-link nav-link-custom" aria-current="page" href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart3 me-2" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              Giỏ hàng
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
    )
  };

  const authenticateNavbar = () => {
    return(
      <ul className="navbar-nav">
        <li className="nav-item me-2">
          <a className="nav-link nav-link-custom" aria-current="page" href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart3 me-2" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              Giỏ hàng
          </a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link nav-link-custom dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-circle me-2" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
            {user.username}
          </a>
          <ul className="dropdown-menu drop_profile" aria-labelledby="navbarDropdown">
            <li><NavLink className="dropdown-item" to="/profile">Hồ sơ cá nhân</NavLink></li>
            <li><Link className="dropdown-item" to="/" onClick={onLogout} >Đăng xuất</Link></li>
          </ul>
        </li>
      </ul>
    ); 
  };

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
            {isAuthenticated ? authenticateNavbar() : unauthenticateNavbar()}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
