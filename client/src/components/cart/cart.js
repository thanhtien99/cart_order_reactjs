import React from "react";

function Cart({ cart }) {
  return (
    <div className="cart mt-4">
      <h3>Giỏ hàng</h3>
      {cart.length > 0 ? (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - Số lượng: {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>Giỏ hàng trống</p>
      )}
    </div>
  );
}

export default Cart;
