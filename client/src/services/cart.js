import axios from "../utils/api";
import { setSessionItem, getSessionItem } from "../utils/set_session_storage";

const addCart = async (user_id, product, quantity = 1) => {
  try {
    const totalPrice = product.price * quantity;

    const cartData = {
        user: user_id,
        product: {
          id: product._id,
          name: product.name,
          thumbnail: product.thumbnail,
          price: product.price,
        },
        quantity: quantity,
        total_price: totalPrice,
    };
    
    const response = await axios.post('/cart/', cartData);
    return response.data; 
  } catch (error) {
    return error;
  }
};

const getCart = async (user) => {
  try {
    const response = await axios.get('/cart', {
      params: { user: user._id }
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return { error: error.response?.data?.error || "Unknown error" };
  }
};

const addCartToSession = async (product, quantity = 1) => {
  try {
      const cartData = getSessionItem("cart_session") || [];
      const existingProductIndex = cartData.findIndex(item => item.product.id === product._id);
      const totalPrice = product.price * quantity;

      if (existingProductIndex !== -1) {
        cartData[existingProductIndex].quantity += quantity;
        cartData[existingProductIndex].total_price = cartData[existingProductIndex].quantity * product.price;
      } else {
          cartData.push({
            product: {
              id: product._id,
              name: product.name,
              thumbnail: product.thumbnail,
              price: product.price,
            },
            quantity: quantity,
            total_price: totalPrice,
          });
      }

      setSessionItem("cart_session", cartData);

      return cartData;
  } catch (error) {
      console.error("Error adding to session:", error);
      return error;
  }
};


export { addCart, getCart, addCartToSession };
