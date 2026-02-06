import api from "@/lib/api";

export const getSummary = async () => {
  try {
    const response = await api.get(`/loyalty/summary`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching loc points summary`, error);
    throw error;
  }
};

export const getLoyaltyUsers = async () => {
  try {
    const response = await api.get(`/loyalty/users`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching loyalty users`, error);
    throw error;
  }
};

export const getLoyaltySettings = async () => {
  try {
    const response = await api.get(`/loyalty/settings`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching loyalty settings`, error);
    throw error;
  }
};

export const updateLoyaltySettings = async (data) => {
  try {
    const response = await api.put(`/loyalty/settings`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating loyalty settings`, error);
    throw error;
  }
};