export const getLocalStorageItem = (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;  
};

export const setLocalStorageItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
