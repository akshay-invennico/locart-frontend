import { api } from "@/lib/api";

export const createPortfolio = async (formData) => {
  try {
    const response = await api.post("/album", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create portfolio"
    );
  }
};

export const getAllPortfolios = async () => {
  try {
    const response = await api.get("/album");

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch portfolio list"
    );
  }
};

export const getPortfolioById = async (id) => {
  try {
    const response = await api.get(`/album/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch portfolio details"
    );
  }
};

