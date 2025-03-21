import React, { useEffect, useState } from "react";
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from "../../context/authContext";
import { logout } from "../../services/account";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/addCart";
import { socket } from "../../socket";
import { searchProducts } from "../../services/product";
import { formatCurrency } from "../../utils/fomat";

function Navbar() {
  const navigate = useNavigate();
  const {isAuthenticated, setIsAuthenticated, user, setUser} = useAuth();
  const { cart, setCart } = useCartContext();
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState({ products: [] });

  //Socket
  useEffect(() => {
    if(isAuthenticated){
      socket.on("update-cart-qty", (cart) => {
        setCart(cart);
    });
    }
  }, []);

  const onLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.length > 1) {
      const result = await searchProducts(value);
      if (result.success) {
        setSuggestions(result);
      }
    } else {
      setSuggestions({ products: [] });
    }
  };

  const handleSelectSuggestion = (product) => {
    setKeyword("");
    setSuggestions({ products: [] });
    navigate(`/product/${product._id}`);
  };

  const unauthenticateNavbar = () => {
    return(
      <ul className="navbar-nav">
        <li className="nav-item me-2">
          <NavLink className="nav-link nav-link-custom position-relative" aria-current="page" to="/cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart3 me-2" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              Giỏ hàng
              <span className={`${cart ? "" : "d-none"} position-absolute translate-middle badge rounded-pill bg-danger badge_card`}>
                {cart ? cart : ''}
              </span>
          </NavLink>
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
          <NavLink className="nav-link nav-link-custom position-relative" aria-current="page" to="/cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart3 me-2" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              Giỏ hàng
              <span className={`${cart ? "" : "d-none"} position-absolute translate-middle badge rounded-pill bg-danger badge_card`}>
                {cart ? cart : ''}
              </span>
          </NavLink>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link nav-link-custom dropdown-toggle" href="/#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-circle me-2" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
            {user.username}
          </a>
          <ul className="dropdown-menu drop_profile" aria-labelledby="navbarDropdown">
            <li><NavLink className="dropdown-item" to="/profile">Hồ sơ cá nhân</NavLink></li>
            <li><NavLink className="dropdown-item" to="/order">Đơn mua</NavLink></li>
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
                value={keyword}
                onChange={handleSearchChange}
              />
              {suggestions.products.length > 0 ? (
                <ul className="suggestions">
                  {suggestions.products.length > 0 && (
                    <>
                      <li className="suggestion-title">Sản phẩm gợi ý</li>
                      {suggestions.products.map((product) => (
                        <li key={product._id} className="suggestion-item" onClick={() => handleSelectSuggestion(product)}>
                          <img src={product.thumbnail} alt={product.name} className="suggestion-img" />
                          <div className="suggestion-info">
                            <p className="suggestion-name">{product.name}</p>
                            <p className="suggestion-price">{formatCurrency(product.price)}đ</p>
                          </div>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              ) : null}
            </form>
            {isAuthenticated ? authenticateNavbar() : unauthenticateNavbar()}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
