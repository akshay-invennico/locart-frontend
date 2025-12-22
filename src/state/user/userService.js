import { api } from "@/lib/api";

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

export const updateProfile = async (payload) => {
  try {
    const response = await api.put("/user/profile", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

export const updatePassword = async (payload) => {
  try {
    const response = await api.put("/user/password/change", payload);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update password"
    );
  }
};
