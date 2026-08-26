import api from "./api";

export const signup = (userData) => {
    return api.post("/auth/register", userData);
};

export const login = (credentials) => {
    return api.post("/auth/login", credentials);
};

export const socialLogin = (socialData) => {
    return api.post("/auth/social", socialData);
};