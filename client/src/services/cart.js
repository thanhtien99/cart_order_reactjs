import axios from "../utils/api";

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

export { addCart };
