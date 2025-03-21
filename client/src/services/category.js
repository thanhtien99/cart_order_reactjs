import axios from "../utils/api";

const categoryList = async () => {
  try {
    const response = await axios.get("/category/");
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

export { categoryList };
