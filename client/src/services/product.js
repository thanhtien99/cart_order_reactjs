import axios from "../utils/api";

const productList = async () => {
  try {
    const response = await axios.get("/product/");
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

export { productList };