import { toast } from 'react-toastify';

// Success Notification
export const notifySuccess = (msg, opts={}) => {
    return toast.success(msg, opts);
};

// Error Notification
export const notifyError = (msg, opts={}) => {
    return toast.error(msg, opts);
};

// Custom Notification
export const notifyCustom = (msg) => {
    return toast(<div style={{ color: "blue" }}>{msg}</div>, {
        position: "top-center",
        autoClose: 5000,
    });
};
