export const getToken = () => localStorage.getItem('accessToken');
export const setToken = (t) => localStorage.setItem('accessToken', t);
export const removeToken = () => localStorage.removeItem('accessToken');
