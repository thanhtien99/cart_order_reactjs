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
          quantity: quantity,
        },
        total_product: quantity,
        total_price: totalPrice,
    };
    
    console.log("Zxczxczxcefsrgsdfbxfcvb", cartData);
    
    const response = await axios.post('/cart/', cartData);
    console.log('Cart added successfully:', response.data);
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

export { addCart };
