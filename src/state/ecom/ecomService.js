import { api } from "@/lib/api";

export const getAllOrders = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.orderStatus) params.append("orderStatus", filters.orderStatus);
    if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.amountMin) params.append("amountMin", filters.amountMin);
    if (filters.amountMax) params.append("amountMax", filters.amountMax);

    const response = await api.get(`ecom/orders?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createEcomOrder = async (payload) => {
  try {
    const response = await api.post("ecom/orders", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateOrderStatus = async (orderIds, status) => {
  try {
    const response = await api.patch("ecom/orders", { orderIds, status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const flagOrders = async (orderIds, reason) => {
  try {
    const response = await api.patch("ecom/orders/flag", { orderIds, reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`ecom/orders/${orderId}`);
    return response.data.data; // assuming your response structure
  } catch (error) {
    console.error("Error fetching order:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getAllProducts = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");

    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);

    if (filters.category && Array.isArray(filters.category)) {
      filters.category.forEach((cat) => params.append("category[]", cat));
    }

    if (filters.status) params.append("status", filters.status);
    if (filters.priceMin) params.append("priceMin", filters.priceMin);
    if (filters.priceMax) params.append("priceMax", filters.priceMax);
    if (filters.stockMin) params.append("stockMin", filters.stockMin);
    if (filters.stockMax) params.append("stockMax", filters.stockMax);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.type) params.append("type", filters.type);

    const response = await api.get(`ecom/product?${params.toString()}`);

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProductService = async (formData) => {
  try {
    const response = await api.post("ecom/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const bulkUpdateProductStatusService = async (productIds, status) => {
  try {
    const response = await api.patch("ecom/product/bulk-status", {
      productIds,
      status
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

export const bulkDeleteProductsService = async (productIds) => {
  try {
    const response = await api.delete("ecom/product/bulk-delete", {
      data: { productIds },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

export const updateProductStatusService = async (productId, status) => {
  try {
    const response = await api.patch(`ecom/product/${productId}`, {
      status: status.toLowerCase(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProductService = async (productId) => {
  try {
    const response = await api.delete(`ecom/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getAllCategories = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    params.append("search", filters.search || "");
    params.append("status", filters.status !== undefined ? filters.status : "");
    params.append("type", filters.type || "service");

    const res = await api.get(`ecom/category?${params.toString()}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const res = await api.get(`ecom/category/${categoryId}`);
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

export const updateCategoryStatusService = async (categoryId, status) => {
  try {
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    const response = await api.patch(`ecom/category/bulk-status`, {
      ids: [categoryId],
      status: formattedStatus,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



export const deleteCategoryService = async (categoryId) => {
  try {
    const response = await api.delete(`ecom/category/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createCategoryService = async (payload) => {
  try {
    const res = await api.post("ecom/category", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateCategoryService = async (categoryId, payload) => {
  try {
    const res = await api.patch(`ecom/category/${categoryId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};


export const getProductById = async (productId) => {
  try {
    const res = await api.get(`ecom/product/${productId}`);
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
