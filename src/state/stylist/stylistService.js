import { api } from "@/lib/api";

export const getAllStylists = async () => {
  try {
    const { data } = await api.get("/store/stylists");
    return data;
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Failed to fetch stylists";
    console.error(`Stylist API error (${status}): ${message}`);
    throw error;
  }
};


export const getStylistsById = async (id) => {
  try {
    const { data } = await api.get(`/store/stylists/${id}`)
    return data
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Failed to fetch stylist";
    console.error(`Stylist API error (${status}): ${message}`);
    throw error;
  }
}

export const createStylist = async (data) => {
  try {
    const response = await api.post("/store/stylists", data);
    return response.data;
  } catch (error) {
    console.error("Error creating stylist:", error);
    throw error.response?.data || { message: "Failed to create stylist" };
  }
};

export const updateStylistService = async (stylistId, payload) => {
  try {
    const res = await api.patch(
      "store/stylists",
      payload,
      {
        params: { stylistId },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};



export const deleteStylistById = async (id) => {
  try {
    const response = await api.delete(`/store/stylists/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting stylist:", error);
    throw error.response?.data || { message: "Failed to delete stylist" };
  }
};

