import React from "react";
import { NavLink } from "react-router";
import styles from "../../static/css/cart.module.css";
// import OrderDelivery from "./order_delivering";
import OrderSuccess from "./order_success";

function Order() {
  // const [activeTab, setActiveTab] = useState("success");

  return (
    <>
      <section className="w-100 flex-grow-1">
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
              <h4 className="fw-normal mb-0 w-100 fw-bold">Đơn hàng đã mua</h4>
            </div>
            {/* <div className="col-8 d-flex mb-4">
              <button
                className={`btn me-2 ${styles["button-tab-order"]} ${activeTab === "delivery" ? styles["active-tab"] : ""}`}
                onClick={() => setActiveTab("delivery")}
              >
                Đang giao hàng
              </button>
              <button
                className={`btn me-2 ${styles["button-tab-order"]} ${activeTab === "success" ? styles["active-tab"] : ""}`}
                onClick={() => setActiveTab("success")}
              >
                Thành công
              </button>
            </div> */}
            {/* {activeTab === "delivery" && <OrderDelivery />} */}
            {<OrderSuccess />}
          </div>
        </div>
      </section>
    </>
  );
}

export default Order;
