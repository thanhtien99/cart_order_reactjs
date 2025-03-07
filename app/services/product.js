import api from "../utils/api";

const productList = async () => {
  try {
    const response = await api.get("/product/");
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

export { productList, productDetail };
