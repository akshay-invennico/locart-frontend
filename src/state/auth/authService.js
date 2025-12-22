import  api  from "@/lib/api";

export const login = (credentials) => {
  return api.post(`/auth/login`, credentials);

};

export const refreshAccessToken = (refreshToken) => {
  return api.post(`/auth/refresh`,  {refreshToken} );
};

export const forgotPassword = (email) => {
  return api.post(`/auth/forgot-password`, { email });
};


export const verifyResetToken = (token) => {
  return api.get(`/auth/verify-reset-token/${token}`);
};

export const resetPassword = ({ token, password }) => {
  return api.post(`/auth/reset-password`, { token, password });
};

export const getProfile = async () => {
  try {
    const response = await api.get(`/auth/me`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
};