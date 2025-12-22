import api from "@/lib/api";

export const getAllAppointments = async (filters = {}) => {
  try {
    const params = {};

    if (filters.status && !filters.status.includes("all")) {
      params.status = filters.status.join(",");
    }

    if (filters.joinedDate) {
      params.start_date = filters.joinedDate[0];
      params.end_date = filters.joinedDate[1];
    }

    if (filters.numberRange) {
      params.min_amount = filters.numberRange[0];
      params.max_amount = filters.numberRange[1];
    }

    if (filters.TimeRange) {
      params.start_time = filters.TimeRange[0];
      params.end_time = filters.TimeRange[1];
    }

    if (filters.stylist && filters.stylist.length) {
      params.stylist_ids = filters.stylist.join(",");
    }

    if (filters.service && filters.service.length) {
      params.service_ids = filters.service.join(",");
    }

    const response = await api.get("/appointment", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};


export const getAppointmentDetails = async (booking_id) => {
  try {
    const response = await api.get(`/appointment/${booking_id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment ${booking_id}:`, error);
    throw error;
  }
};

export const updateAppointment = async (booking_id, payload) => {
  try {
    const response = await api.patch(`/appointment/${booking_id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating appointment ${booking_id}:`, error);
    throw error;
  }
};

export const getRefundSummary = async (booking_id) => {
  try {
    const response = await api.get(`/appointment/${booking_id}/refund`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching refund summary for appointment ${booking_id}:`, error);
    throw error;
  }
};

export const createAppointment = async (payload) => {
  try {
    const response = await api.post("/appointment", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};


export const updateAppointmentStatus = async (payload) => {
  try {
    const response = await api.patch(`/appointment/bulk/status`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

export const initiateRefund = async (booking_id, payload) => {
  try {
    const response = await api.post(`/appointment/${booking_id}/refund`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error initiating refund for appointment ${booking_id}:`, error);
    throw error;
  }
};
