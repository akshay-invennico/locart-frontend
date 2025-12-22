import { api } from "@/lib/api";

/**
 * Get all clients with optional filters
 * @param {Object} params
 */
export const getAllClients = async (params = {}) => {
  try {
    const {
      search = "",
      status = "",
      clientType = "",
      joinedFrom = "",
      joinedTo = "",
      minSpent = "",
      maxSpent = "",
      sortBy = "created_at",
      sortOrder = "asc",
      page = 1,
      limit = 10,
    } = params;

    const query = `/client/?search=${search}&status=${status}&clientType=${clientType}&joinedFrom=${joinedFrom}&joinedTo=${joinedTo}&minSpent=${minSpent}&maxSpent=${maxSpent}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`;

    const { data } = await api.get(query);
    return data;
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Failed to fetch clients";
    console.error(`Client API error (${status}): ${message}`);
    throw error;
  }
};

/**
 * Get a single client by ID
 * @param {string} id
 */
export const getClientDetails = async (clientId) => {
  try {
    const response = await api.get(`/client/${clientId}/overview`);
    return response.data;
  } catch (error) {
    console.error("Error fetching client details:", error);
    console.error({
      status: error?.response?.status,
      data: error?.response?.data,
      url: error?.config?.url,
    });
    throw error;
  }
};

/**
 * Create a new client
 * @param {Object} payload
 */
export const createClient = async (payload) => {
  try {
    const response = await api.post("/client", payload);
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.message || "Failed to create client";
    console.error("Error creating client:", message);
    throw error;
  }
};

/**
 * Update a client by ID
 * @param {string} id
 * @param {Object} payload
 */
export const updateClientById = async (id, payload) => {
  try {
    const { data } = await api.patch(`/client/${id}`, payload);
    return data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error?.response?.data || { message: "Failed to update client" };
  }
};

export const getClientBookings = async (clientId) => {
  try {
    const response = await api.get(`/client/${clientId}/bookings`);
    console.log("Client bookings:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching client bookings:", error);
    console.error({
      status: error?.response?.status,
      data: error?.response?.data,
      url: error?.config?.url,
    });
    throw error;
  }
};


export const archiveClients = async (clientIds, reason = "Requested by management") => {
  try {
    const { data } = await api.patch("/client/archive", {
      client_ids: clientIds,
      reason,
    });
    return data;
  } catch (error) {
    console.error("Error archiving clients:", error);
    throw error;
  }
};

export const getClientOrders = async (clientId, params = {}) => {
  try {
    const {
      deliveryStatus = "",
      dateFrom = "",
      dateTo = "",
      minAmount = "",
      maxAmount = "",
      page = 1,
      limit = 10,
    } = params;

    const query = `/client/${clientId}/orders?deliveryStatus=${deliveryStatus}&dateFrom=${dateFrom}&dateTo=${dateTo}&minAmount=${minAmount}&maxAmount=${maxAmount}&page=${page}&limit=${limit}`;

    const { data } = await api.get(query);
    return data;
  } catch (error) {
    console.error("Error fetching client orders:", error);
    throw error?.response?.data || error.message;
  }
};

export const suspendClients = async (clientIds, reason) => {
  try {
    const { data } = await api.patch("/client/suspend", {
      client_ids: clientIds,
      reason,
    });
    return data;
  } catch (error) {
    console.error("Error suspending clients:", error);
    throw error?.response?.data || error.message;
  }
};
