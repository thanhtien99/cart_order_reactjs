import { toast } from 'react-toastify';

// Success Notification
export const notifySuccess = (msg) => {
    return toast.success(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
};

// Error Notification
export const notifyError = (msg) => {
    return toast.error(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
};

// Custom Notification
export const notifyCustom = (msg) => {
    return toast(<div style={{ color: "blue" }}>{msg}</div>, {
        position: "top-center",
        autoClose: 5000,
    });
};
