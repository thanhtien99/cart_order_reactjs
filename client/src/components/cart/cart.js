import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";
import styles from "../../static/css/cart.module.css";
import { useAuth } from "../../context/authContext";
import { useCartContext } from "../../context/addCart";
import { getCart, updateCart, deleteCart, addOrder } from "../../services/cart";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeCartItemLocalStorage,
} from "../../utils/localStorage";
import { formatCurrency } from "../../utils/fomat";
import { useNavigate } from "react-router";
import { notifySuccess, notifyError } from '../../utils/toastify';
import { socket } from '../../socket';

function Cart() {
  const [cartList, setCartList] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { cart, setCart } = useCartContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        if (isAuthenticated) {
          const response = await getCart(user);
          setCartList(response.data);
        } else {
          const response = getLocalStorageItem("cart_local");
          setCartList(response || []);
        }
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    };

    fetchCarts();
  }, [isAuthenticated, user]);

  //Socket
  useEffect(() => {
    if(isAuthenticated){
      if(cart > 0){
        socket.emit('add-to-cart', cart)
      }
    }
  }, [cart]);

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (isAuthenticated) {
      try {
        await updateCart(cartId, newQuantity);
        setCartList((prevCartList) => {
          return prevCartList.map((cart) => {
            if (cart._id === cartId) {
              cart.quantity = newQuantity;
              cart.total_price = cart.product.price * newQuantity;
            }
            return cart;
          });
        });

        const currentItem = cartList.find((c) => c._id === cartId);
        setCart((prev) => prev + (newQuantity - (currentItem?.quantity || 0)));
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    } else {
      const localCart = [...cartList];
      const cartIndex = localCart.findIndex(
        (item) => item.product.id === cartId
      );
      if (cartIndex > -1) {
        localCart[cartIndex].quantity = newQuantity;
        localCart[cartIndex].total_price =
          localCart[cartIndex].product.price * newQuantity;
        setLocalStorageItem("cart_local", localCart);
        const totalQuantity = localCart.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        setCart(totalQuantity);
      }
    }
  };

  const handleInputChange = (cartId, value) => {
    const newQuantity = parseInt(value, 10);
    if (isNaN(newQuantity) || newQuantity <= 0) return;
    handleQuantityChange(cartId, newQuantity);
  };

  const handleIncrement = (cartId, currentQuantity) => {
    handleQuantityChange(cartId, currentQuantity + 1);
  };

  const handleDecrement = (cartId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(cartId, currentQuantity - 1);
    }
  };

  const handleRemoveCart = async (cart) => {
    if (isAuthenticated) {
      try {
        await deleteCart(cart);
        setCartList((prevCartList) => {
          if (!prevCartList || !Array.isArray(prevCartList)) {
            console.error("prevCartList invalid:", prevCartList);
            return prevCartList;
          }
          const updatedCartItems = prevCartList.filter((item) => item._id !== cart._id);
  
          return updatedCartItems;
        });
        setCart((prev) => prev - cart.quantity);

        // close the modal
        const modalElement = document.getElementById(`deleteModal-${cart._id}`);
        const backdrop = document.querySelector(".modal-backdrop");
        modalElement.classList.remove("show")
        if (backdrop) {
          backdrop.remove();
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
          document.body.classList.remove("modal-open");
        }
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    } else {
      const localCart = [...cartList];
      const cartIndex = localCart.findIndex(
        (item) => item.product.id === cart.product.id
      );
      if (cartIndex > -1) {
        removeCartItemLocalStorage(cart.product.id);
        const updatedCart = localCart.filter(
          (item) => item.product.id !== cart.product.id
        );
        const totalQuantity = updatedCart.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        setCartList(updatedCart);
        setCart(totalQuantity);

        // close the modal
        const modalElement = document.getElementById(
          `deleteModal-${cart.product.id}`
        );
        const backdrop = document.querySelector(".modal-backdrop");
        modalElement.classList.remove("show");
        if (backdrop) {
          backdrop.remove();
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
          document.body.classList.remove("modal-open");
        }
      }
    }
  };

  const handleViewDetails = (product_id) => {
    navigate(`/product/${product_id}`);
  };

  const handleAddOrder = async (user) => {
    try {
      await addOrder(user._id);
      setCart(0);
      notifySuccess("Cart added successfully");
      navigate(`/order`);
      // close the modal
      const modalElement = document.getElementById("orderModal");
      const backdrop = document.querySelector(".modal-backdrop");
      modalElement.classList.remove("show");
      if (backdrop) {
        backdrop.remove();
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        document.body.classList.remove("modal-open");
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      notifyError("Failed to add to cart. Please try again.");
    }
  };

  return (
    <>
      {isAuthenticated ? (
        cartList.length > 0 ? (
          <section className="h-100">
            <div className="container h-100 py-5">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-8 d-flex mb-4">
                  <NavLink className={`${styles["cart_title_top"]}`} to="/">
                    <svg
                      className="w-5 h-5 text-[#101828]"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m15 19-7-7 7-7"
                      ></path>
                    </svg>
                  </NavLink>
                  <h4 className="fw-normal mb-0 w-100 fw-bold">Giỏ Hàng</h4>
                </div>
                <div className={`${styles["cart_body"]} col-8`}>
                  <div
                    className={`${styles["card_user_info"]} card rounded-3 mb-4 p-3 text-start`}
                  >
                    <h6 className="mb-2">
                      <strong>Người nhận:</strong> {user.username} - 0
                      {user.phone}
                    </h6>

                    <p className="d-flex text-muted mb-0 align-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-geo-alt-fill me-1 text-danger"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                      </svg>
                      {user.address}
                    </p>
                  </div>

                  {cartList.map((cart) => (
                    <div className="card rounded-3 mb-4" key={cart._id}>
                      <div className="card-body p-4">
                        <div className="row d-flex align-items-center">
                          <div className="col-md-2 col-lg-2 col-xl-2">
                            <img
                              src={cart.product.thumbnail}
                              className={`${styles["img_product"]} img-fluid rounded-3`}
                              alt="Product"
                              onClick={() => handleViewDetails(cart.product._id)}
                            />
                          </div>
                          <div className="col-md-10 col-lg-10 col-xl-10 d-flex justify-content-between">
                            <div className="">
                              <h6
                                className={`${styles["product_name"]} fw-bold mb-2`}
                                onClick={() => handleViewDetails(cart.product._id)}
                              >
                                {cart.product.name}
                              </h6>
                            </div>

                            <div className="text-end">
                              <p className="mb-0 text-danger">
                                {formatCurrency(cart.product.price)}đ
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <div className="">
                            <button
                              className="btn text-danger"
                              data-bs-toggle="modal"
                              data-bs-target={`#deleteModal-${cart._id}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash3-fill text-danger"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                              </svg>
                            </button>
                          </div>
                          <div className="d-flex align-items-center">
                            <button
                              className={`${styles["minus_button"]} btn px-2`}
                              onClick={() =>
                                handleDecrement(cart._id, cart.quantity)
                              }
                              disabled={cart.quantity <= 1}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={cart.quantity}
                              min="1"
                              className={`${styles["no-spinners"]} form-control form-control-sm text-center`}
                              onChange={(e) =>
                                handleInputChange(cart._id, e.target.value)
                              }
                            />
                            <button
                              className={`${styles["plus_button"]} btn px-2`}
                              onClick={() =>
                                handleIncrement(cart._id, cart.quantity)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Modal */}
                      <div
                        className="modal fade"
                        id={`deleteModal-${cart._id}`}
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body fw-bold">
                              Bạn có chắc muốn xoá sản phẩm này?
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Huỷ
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleRemoveCart(cart)}
                              >
                                Xoá
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total Section */}
                  <div className={`card rounded-3 mb-4 p-3 text-start`}>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="d-flex mb-0 align-items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-receipt-cutoff text-primary me-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5M11.5 4a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z" />
                          <path d="M2.354.646a.5.5 0 0 0-.801.13l-.5 1A.5.5 0 0 0 1 2v13H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H15V2a.5.5 0 0 0-.053-.224l-.5-1a.5.5 0 0 0-.8-.13L13 1.293l-.646-.647a.5.5 0 0 0-.708 0L11 1.293l-.646-.647a.5.5 0 0 0-.708 0L9 1.293 8.354.646a.5.5 0 0 0-.708 0L7 1.293 6.354.646a.5.5 0 0 0-.708 0L5 1.293 4.354.646a.5.5 0 0 0-.708 0L3 1.293zm-.217 1.198.51.51a.5.5 0 0 0 .707 0L4 1.707l.646.647a.5.5 0 0 0 .708 0L6 1.707l.646.647a.5.5 0 0 0 .708 0L8 1.707l.646.647a.5.5 0 0 0 .708 0L10 1.707l.646.647a.5.5 0 0 0 .708 0L12 1.707l.646.647a.5.5 0 0 0 .708 0l.509-.51.137.274V15H2V2.118z" />
                        </svg>
                        Sử dụng mã giảm giá
                      </p>
                      <button
                        className="btn"
                        onClick={() => console.log("Increase quantity")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-chevron-right fw-bold"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                          />
                        </svg>
                      </button>
                    </div>
                    <hr />
                    <p className="d-flex mb-0 align-items-center justify-content-between fw-bold">
                      <span>Tổng tiền:</span>
                      <span>
                        {formatCurrency(
                          cartList.reduce(
                            (total, item) => total + item.total_price,
                            0
                          )
                        )}đ
                      </span>
                    </p>
                    <hr />
                    <div>
                      <p className="fw-bold">Hình thức thanh toán</p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                        />
                        <label
                          className="form-check-label align-items-center text-muted"
                          htmlFor="flexRadioDefault1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-cash me-2 text-primary"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                            <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                          </svg>
                          Thanh toán tiền mặt khi nhận hàng
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          checked
                        />
                        <label
                          className="form-check-label align-items-center text-muted"
                          htmlFor="flexRadioDefault2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-bank2 me-2 text-primary"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916zM12.375 6v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1z" />
                          </svg>
                          Chuyển khoản ngân hàng
                        </label>
                      </div>
                      <button
                        type="button"
                        className={`${styles["btn_book_cart"]} btn`}
                        data-bs-toggle="modal"
                        data-bs-target="#orderModal">
                        Đặt hàng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Modal */}
            <div
              className="modal fade"
              id="orderModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body fw-bold">
                    Bạn có chắc muốn mua những sản phẩm này?
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Huỷ
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleAddOrder(user)}
                      >
                      Đồng ý
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className={styles["cart-empty"]}>
            <img
              src="https://cdn.tgdd.vn/mwgcart/v2/vue-pro/img/empty-cart.22a86c722e7023e53b0dd30fe.png"
              className={styles["iconcart-empty"]}
              alt=""
            ></img>
            <h1>Giỏ hàng trống</h1>
            <span className="dmx">Không có sản phẩm nào trong giỏ hàng</span>
            <NavLink to="/" className={styles["btn-backhome"]}>
              Về trang chủ
            </NavLink>
          </div>
        )
      ) : cartList.length > 0 ? (
        <section className="h-100">
          <div className="container h-100 py-5">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-8 d-flex mb-4">
                <NavLink className={`${styles["cart_title_top"]}`} to="/">
                  <svg
                    className="w-5 h-5 text-[#101828]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m15 19-7-7 7-7"
                    ></path>
                  </svg>
                </NavLink>
                <h4 className="fw-normal mb-0 w-100 fw-bold">Giỏ Hàng</h4>
              </div>
              <div className={`${styles["cart_body"]} col-8`}>
                <div
                  className={`${styles["card_user_info"]} card rounded-3 mb-4 p-3 text-start`}
                >
                  <h6 className="mb-2 d-flex justify-content-between align-items-center text-primary">
                    Vui lòng cung cấp thông tin nhận hàng
                    <button
                      className="btn"
                      onClick={() => console.log("Increase quantity")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-right fw-bold text-primary"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                        />
                      </svg>
                    </button>
                  </h6>
                </div>

                {cartList.map((cart) => (
                  <div className="card rounded-3 mb-4" key={cart.product.id}>
                    <div className="card-body p-4">
                      <div className="row d-flex align-items-center">
                        <div className="col-md-2 col-lg-2 col-xl-2">
                          <img
                            src={cart.product.thumbnail}
                            className={`${styles["img_product"]} img-fluid rounded-3`}
                            alt="Product"
                            onClick={() => handleViewDetails(cart.product.id)}
                          />
                        </div>
                        <div className="col-md-10 col-lg-10 col-xl-10 d-flex justify-content-between">
                          <div className="">
                            <h6
                              className={`${styles["product_name"]} fw-bold mb-2`}
                              onClick={() => handleViewDetails(cart.product.id)}
                            >
                              {cart.product.name}
                            </h6>
                          </div>

                          <div className="text-end">
                            <p className="mb-0 text-danger">
                              {formatCurrency(cart.product.price)}đ
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <div className="">
                          <button
                            className="btn text-danger"
                            data-bs-toggle="modal"
                            data-bs-target={`#deleteModal-${cart.product.id}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-trash3-fill text-danger"
                              viewBox="0 0 16 16"
                            >
                              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                            </svg>
                          </button>
                        </div>
                        <div className="d-flex align-items-center">
                          <button
                            className={`${styles["minus_button"]} btn px-2`}
                            onClick={() =>
                              handleDecrement(cart.product.id, cart.quantity)
                            }
                            disabled={cart.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={cart.quantity}
                            min="1"
                            className={`${styles["no-spinners"]} form-control form-control-sm text-center`}
                            onChange={(e) =>
                              handleInputChange(cart.product.id, e.target.value)
                            }
                          />
                          <button
                            className={`${styles["plus_button"]} btn px-2`}
                            onClick={() =>
                              handleIncrement(cart.product.id, cart.quantity)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Modal */}
                    <div
                      className="modal fade"
                      id={`deleteModal-${cart.product.id}`}
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body fw-bold">
                            Bạn có chắc muốn xoá sản phẩm này?
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Huỷ
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleRemoveCart(cart)}
                            >
                              Xoá
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total Section */}
                <div className={`card rounded-3 mb-4 p-3 text-start`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="d-flex mb-0 align-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-receipt-cutoff text-primary me-1"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5M11.5 4a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z" />
                        <path d="M2.354.646a.5.5 0 0 0-.801.13l-.5 1A.5.5 0 0 0 1 2v13H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H15V2a.5.5 0 0 0-.053-.224l-.5-1a.5.5 0 0 0-.8-.13L13 1.293l-.646-.647a.5.5 0 0 0-.708 0L11 1.293l-.646-.647a.5.5 0 0 0-.708 0L9 1.293 8.354.646a.5.5 0 0 0-.708 0L7 1.293 6.354.646a.5.5 0 0 0-.708 0L5 1.293 4.354.646a.5.5 0 0 0-.708 0L3 1.293zm-.217 1.198.51.51a.5.5 0 0 0 .707 0L4 1.707l.646.647a.5.5 0 0 0 .708 0L6 1.707l.646.647a.5.5 0 0 0 .708 0L8 1.707l.646.647a.5.5 0 0 0 .708 0L10 1.707l.646.647a.5.5 0 0 0 .708 0L12 1.707l.646.647a.5.5 0 0 0 .708 0l.509-.51.137.274V15H2V2.118z" />
                      </svg>
                      Sử dụng mã giảm giá
                    </p>
                    <button
                      className="btn"
                      onClick={() => console.log("Increase quantity")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-right fw-bold"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                        />
                      </svg>
                    </button>
                  </div>
                  <hr />
                  <p className="d-flex mb-0 align-items-center justify-content-between fw-bold">
                    <span>Tổng tiền:</span>
                    <span>
                      {formatCurrency(
                        cartList.reduce(
                          (total, item) => total + item.total_price,
                          0
                        )
                      )}
                      đ
                    </span>
                  </p>
                  <hr />
                  <div>
                    <p className="fw-bold">Hình thức thanh toán</p>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                      />
                      <label
                        className="form-check-label align-items-center text-muted"
                        htmlFor="flexRadioDefault1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-cash me-2 text-primary"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                          <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                        </svg>
                        Thanh toán tiền mặt khi nhận hàng
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                      />
                      <label
                        className="form-check-label align-items-center text-muted"
                        htmlFor="flexRadioDefault2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-bank2 me-2 text-primary"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916zM12.375 6v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1z" />
                        </svg>
                        Chuyển khoản ngân hàng
                      </label>
                    </div>
                    <button
                      type="button"
                      className={`${styles["btn_book_cart"]} btn`}
                    >
                      Đặt hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className={styles["cart-empty"]}>
          <img
            src="https://cdn.tgdd.vn/mwgcart/v2/vue-pro/img/empty-cart.22a86c722e7023e53b0dd30fe.png"
            className={styles["iconcart-empty"]}
            alt=""
          ></img>
          <h1>Giỏ hàng trống</h1>
          <span className="dmx">Không có sản phẩm nào trong giỏ hàng</span>
          <NavLink to="/" className={styles["btn-backhome"]}>
            Về trang chủ
          </NavLink>
        </div>
      )}
    </>
  );
}

export default Cart;
