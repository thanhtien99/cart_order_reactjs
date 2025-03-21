import React, { useEffect, useState } from "react";
import styles from "../../static/css/product.module.css";
import { productList} from "../../services/product";
import { useAuth } from "../../context/authContext";
import { addCart, addCartToLocalStorage } from "../../services/cart";
import { notifySuccess, notifyError } from '../../utils/toastify';
import { useCartContext } from "../../context/addCart";
import { formatCurrency } from "../../utils/fomat";
import { useNavigate } from "react-router-dom";
import { socket } from '../../socket';
import { categoryList } from "../../services/category";
import FilterProduct from "./filter_product";
import SortProduct from "./sort_product";

function ProductList() {
  const [products, setProducts] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { cart, setCart } = useCartContext();
  const navigate = useNavigate();
  
  // filter & sort
  const [categories, setCategories] = useState([]);
  const [filterCategory, setfilterCategory] = useState([]);
  const [filterPrice, setfilterPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryList();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productList({
          category: filterCategory, 
          price_range: filterPrice,
          sort: sortBy
        });
        setProducts(response.data);
        setTotalProducts(response.data.length);
        
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [filterCategory, filterPrice, sortBy]);

  //Socket
  useEffect(() => {
    if(isAuthenticated){
      if(cart > 0){
        socket.emit('add-to-cart', cart)
      }
    }
  }, [cart]);

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

  const handleViewDetails = (product_id) => {
    navigate(`/product/${product_id}`);
  };

  return (
    <div className="row">
      <FilterProduct 
      categories={categories}
      filterCategory={filterCategory} 
      setfilterCategory={setfilterCategory}
      filterPrice={filterPrice}
      setfilterPrice={setfilterPrice}
      />
      <div className="col-9">
        <SortProduct
            categories={categories}
            totalProducts={totalProducts}
            filterCategory={filterCategory}
            setfilterCategory={setfilterCategory}
            filterPrice={filterPrice}
            setfilterPrice={setfilterPrice}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="col-md-6 col-lg-3 mb-4 mb-md-0 mt-3" key={product._id}>
                <div className="card">
                  <img
                    src={product.thumbnail}
                    className={`${styles["image_card_product"]} card-img-top mt-3`}
                    alt="Gaming Laptop"
                    onClick={() => handleViewDetails(product._id)}
                  />
                  <div className="card-body">
                    <div className="d-flex mb-3">
                      <p className={`${styles["product_name"]} mb-0`}
                      onClick={() => handleViewDetails(product._id)}>{product.name}</p>
                    </div>

                    <div className="d-flex">
                      <h6 className="text-danger fw-bold">{formatCurrency(product.price)}đ</h6>
                    </div>

                    <div className="d-flex">
                      <p className="small text-secondary">
                        <s>{formatCurrency(product.original_price)}đ</s>
                      </p>
                    </div>

                    <div className="d-flex">
                      {/* <button type="button" className={`${styles["btn_add_cart"]} btn me-2`}
                        onClick={() => handleAddToCart(product)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-cart3 me-2" viewBox="0 0 16 16">
                          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        Thêm vào giỏ
                      </button> */}
                      <button type="button" className={`${styles["btn_add_cart"]} btn`}
                      onClick={() => handleBuy(product)}>
                        Mua ngay
                      </button>
                    </div>
                    
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h5 className="text-center mt-3">Không có sản phẩm nào</h5>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
