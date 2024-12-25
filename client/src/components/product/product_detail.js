import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productDetail } from "../../services/product";
import { formatCurrency } from "../../utils/fomat";
import styles from "../../static/css/product.module.css";
import { addCart, addCartToLocalStorage } from "../../services/cart";
import { notifySuccess, notifyError } from '../../utils/toastify';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useCartContext } from "../../context/addCart";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { setCart } = useCartContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productDetail(id);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product detail:", error);
        notifyError("Failed to fetch product details.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated){
        await addCart(user._id, product, quantity);
        setCart((prevCart) => prevCart + quantity);
        notifySuccess("Cart added successfully");
      } else{
        await addCartToLocalStorage(product, quantity);
        setCart((prevCart) => prevCart + quantity);
        notifySuccess("Cart added successfully");
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      notifyError("Failed to add to cart. Please try again.");
    }
  };

  const handleBuy = async (product, quantity = 1) => {
    try {
      if (isAuthenticated){
        await addCart(user._id, product, quantity);
        setCart((prevCart) => prevCart + quantity);
        navigate("/cart");
      } else{
        await addCartToLocalStorage(product, quantity);
        setCart((prevCart) => prevCart + quantity);
        navigate("/cart");
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      notifyError("Failed to add to cart. Please try again.");
    }
  };

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mb-4">
          <img
            src={product.thumbnail}
            alt="Product"
            className="img-fluid rounded mb-3 product-image"
            id="mainImage"
          />
        </div>

        <div className="col-md-6 text-start">
          <h2 className="mb-3">{product.name}</h2>
          <div className="mb-3">
            <span className="h4 me-2 text-danger">
              {formatCurrency(product.price)}đ
            </span>
            <span className="text-muted">
              <s>{formatCurrency(product.original_price)}đ</s>
            </span>
          </div>
          <div className="mb-3">
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-half text-warning"></i>
            <span className="ms-2">4.5 (120 reviews)</span>
          </div>
          <p className="mb-4">
            Experience premium sound quality and industry-leading noise
            cancellation with these wireless headphones. Perfect for music
            lovers and frequent travelers.
          </p>
          <div className="d-flex">
            <button
              type="button"
              className={`${styles["btn_add_cart"]} btn me-2`}
              onClick={() => handleAddToCart(product)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                fill="currentColor"
                className="bi bi-cart3 me-2"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
              </svg>
              Thêm vào giỏ
            </button>
            <button type="button" className={`${styles["btn_buy"]} btn`}
            onClick={() => handleBuy(product)}>
              Mua ngay
            </button>
          </div>
          <div className="mt-4">
            <h5>Key Features:</h5>
            <ul>
              <li>Industry-leading noise cancellation</li>
              <li>30-hour battery life</li>
              <li>Touch sensor controls</li>
              <li>Speak-to-chat technology</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
