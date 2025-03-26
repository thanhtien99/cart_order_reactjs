import axios from "../utils/api";

const productList = async ({ category, price_range, sort } = {}) => {
  try {
    const params = {};

    if (category) params.category = category;
    if (price_range) params.price_range = price_range;
    if (sort) params.sort = sort;

    const response = await axios.get("/product/", { params });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      return error.response.data;
    }
    return {
      message: {
        msgBody: "Failed to fetch data",
        msgError: true,
      },
    };
  }
};

const productDetail = async (product_id) => {
  try {
    const response = await axios.get(`/product/${product_id}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      return error.response.data;
    }
    return {
      message: {
        msgBody: "Failed to fetch data",
        msgError: true,
      },
    };
  }
};

const searchProducts = async (keyword) => {
  try {
    const response = await axios.get(`/product/search`, { params: { keyword } });
    return response.data;
  } catch (error) {
    return { success: false, products: [] };
  }
};

export { productList, productDetail, searchProducts };
