import { api } from "@/lib/api";

export const createStore = async (data) => {
  try {
    const response = await api.post(`/store`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create store");
  }
};

export const getStoreDetails = async () => {
  try {
    const response = await api.get("/store/");
    return response.data;
  } catch (error) {
    console.error("Error fetching store details:", error);
    throw error.response?.data || { message: "Failed to fetch store details" };
  }
};

export const getStoreById = async (id) => {
  try {
    const response = await api.get(`/store/${id}`);
    return response.data;
  } catch (error) {
    console.error("[StoreService] Error fetching store:", error);
    throw error.response?.data || { message: "Failed to fetch store" };
  }
};

export const editStore = async (id, data) => {
  try {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value ?? "");
      }
    });

    const response = await api.patch(`/store/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error updating store:", error);
    throw new Error(error.response?.data?.message || "Failed to update store");
  }
};


export const getStoreServices = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.duration) params.append("duration", filters.duration);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const response = await api.get(`/services/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching store services:", error);
    throw error.response?.data || { message: "Failed to fetch store services" };
  }
};


export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error.response?.data || { message: "Failed to delete service" };
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service detail:", error);
    throw error.response?.data || { message: "Failed to fetch service detail" };
  }
};

export const updateService = async (id, data) => {
  try {
    const isFile = data.icon instanceof File;

    if (isFile) {
      const formData = new FormData();

      formData.append("name", data.name?.trim() || "");
      formData.append("description", data.description || "");
      formData.append("duration", Number(data.duration) || 0);
      formData.append("base_price", Number(data.base_price || data.basePrice) || 0);
      formData.append("status", data.status?.toLowerCase() || "active");
      formData.append("icon", data.icon);

      const response = await api.patch(`/services/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    }

    const payload = {
      name: data.name?.trim() || "",
      icon: data.icon || data.iconUrl || "",
      description: data.description || "",
      duration: Number(data.duration) || 0,
      base_price: Number(data.base_price || data.basePrice) || 0,
      status: data.status?.toLowerCase() || "active",
    };

    const response = await api.patch(`/services/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error.response?.data || { message: "Failed to update service" };
  }
};


export const addService = async (formData) => {
  try {
    const response = await api.post("/services", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data?.data;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error.response?.data || { message: "Failed to add service" };
  }
};



export const getAllAmenities = async () => {
  try {
    const response = await api.get("/amenities/");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching amenities:", error);
    throw error.response?.data || { message: "Failed to fetch amenities" };
  }
}

export const addAmenity = async (data) => {
  try {
    const payload = {
      name: data.name,
      description: data.description || "",
    };

    const response = await api.post("/amenities", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating amenity:", error);
    throw error.response?.data || { message: "Failed to create amenity" };
  }
};

export const getAllHolidays = async () => {
  try {
    const response = await api.get("/store/availability/holidays");
    return response.data;
  } catch (error) {
    console.error("Error fetching store holidays:", error);
    throw error.response?.data || { message: "Failed to fetch store holidays" };
  }
}

export const addHoliday = async (data) => {
  try {
    const payload = {
      salonId: data.salonId,
      date: data.date,
      occasion: data.occasion || "",
      description: data.description || "",
    };

    const response = await api.post("/store/availability/holidays", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating holiday:", error);
    throw error.response?.data || { message: "Failed to create holiday" };
  }
};

export const deleteHoliday = async (id) => {
  try {
    const response = await api.delete(
      `/store/availability/holidays?id=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting holiday:", error);
    throw error.response?.data || { message: "Failed to delete holiday" };
  }
};

export const updateHoliday = async (id, data) => {
  try {
    const response = await api.patch(`/store/availability/holidays/?id=${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getStore = async () => {
  try {
    const response = await api.get("/store/locart");
    return response.data;
  } catch (error) {
    console.error("Error fetching store:", error);
    throw error.response?.data || { message: "Failed to fetch store" };
  }
};

export const editStoreOperatingHours = async (salonId, data) => {
  try {
    const response = await api.put(`/store/${salonId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating store operating hours:", error);
    throw error.response?.data || { message: "Failed to update store operating hours" };
  }
}