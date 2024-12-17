import axios from "../utils/api";

const register = async (user) => {
    try {
        const response = await axios.post("/auth/register", user);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return error.response.data; // Trả về thông báo lỗi từ server
        }
        return {
            message: {
              msgBody: "Account creation failed",
              msgError: true,
            },
        };
    }
};

const login = async (user) => {
    try {
        const response = await axios.post("/auth/login", user);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message || "Wrong email or password.";
            return {
                message: {
                    msgBody: errorMessage,
                    msgError: true,
                },
            };
        }
        return {
            message: {
                msgBody: "Đã xảy ra lỗi, vui lòng thử lại sau.",
                msgError: true,
            },
        };
    }
};

const logout = async () => {
    const res = await axios.get("/auth/logout");
    return res.data;
};

const AuthService = { 
    isAuthenticated: async () => {
        try {
            const res = await axios.get("/auth/authenticated");
            
            if (res.status !== 401) {
                return res.data;
            } else {
                return { isAuthenticated: false, user: { email: "", username: "" } };
            }
        } catch (err) {
            console.error("Error during authentication check:", err);
            return { isAuthenticated: false, user: { email: "", username: "" } };
        }
    }
};

export { register, login, logout };
export default AuthService;