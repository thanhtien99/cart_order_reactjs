import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";
import styles from "../../static/css/cart.module.css";
import { useAuth } from "../../context/authContext";
import { getOrder } from "../../services/cart";
import { formatCurrency, formatISOToCustom } from "../../utils/fomat";

function OrderSuccess() {
  const [orderList, setOrderList] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (isAuthenticated) {
          const response = await getOrder(user);
          const orders = response.data.orders;
          const orderItems = response.data.order_items;

          const ordersWithItems = orders.map(order => {
            const itemsForOrder = orderItems.filter(item => item.order.toString() === order._id.toString());
            return { ...order, items: itemsForOrder };
          });

          setOrderList(ordersWithItems);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  return (
    <div className={`${styles["cart_body"]} col-8`}>
      {orderList && orderList.length > 0 ? (
        orderList.map((order) => (
          <div className="card rounded-3 mb-4" key={order._id}>
            <div
              className={`${styles["box_cart_id"]} d-flex justify-content-between`}
            >
              <p className="mb-0">
                <strong>Đơn hàng:</strong> #{order._id}
              </p>
              <p className="fw-bold mb-0">
                {formatISOToCustom(order.createdAt)}
              </p>
            </div>
            <hr />
            <div className="card-body p-4">
              {order.items.map((item) => (
                <>
                <div className="row d-flex align-items-center" key={item._id}>
                  <div className="col-md-2 col-lg-2 col-xl-2">
                    <img
                      src={item.product.thumbnail}
                      className="img-fluid rounded-3"
                      alt="Product"
                    />
                  </div>
                  <div className="col-md-10 col-lg-10 col-xl-10 d-flex justify-content-between">
                    <div className="">
                      <h6 className="fw-bold mb-2">{item.product.name}</h6>
                      <p className="me-2 text-start">SL: {item.quantity}</p>
                    </div>

                    <div className="text-end">
                      <p className="mb-0">
                        {formatCurrency(item.bought_price)}đ
                      </p>
                    </div>
                  </div>
                </div>
                 <hr/>
                 </>
              ))}
              <div className="text-end">
                <h5 className="text-danger">Tổng tiền: {formatCurrency(order.items.reduce((total, item) => total + item.total_price, 0))}đ</h5>
                <button className={`${styles["btn_detail_order"]} btn mt-2`}>
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card rounded-3 mb-4">
          <div className="card-body p-4">
            <div className={styles["cart-empty"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                fill="currentColor"
                className="bi bi-basket3-fill mb-5 text-primary"
                viewBox="0 0 16 16"
              >
                <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.468 15.426.943 9h14.114l-1.525 6.426a.75.75 0 0 1-.729.574H3.197a.75.75 0 0 1-.73-.574z" />
              </svg>
              <h1>Rất tiếc, không tìm thấy đơn hàng nào phù hợp</h1>
              <NavLink to="/" className={styles["btn-backhome"]}>
                Về trang chủ
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderSuccess;
