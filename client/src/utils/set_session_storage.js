export const getSessionItem = (name) => {
    const item = sessionStorage.getItem(name);
    return item ? JSON.parse(item) : null;  
};

export const setSessionItem = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
};
