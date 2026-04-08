/**
 * Stylist self-service API client.
 * All endpoints below are scoped to the *currently authenticated stylist user*
 * (resolved server-side from the JWT — no stylistId is passed from the client).
 *
 * If an endpoint is not yet implemented in the backend, the call will reject
 * with a 404. Pages that consume these calls handle that gracefully and show
 * a "backend pending" placeholder. Once the corresponding endpoint is live in
 * the backend the UI will start working with no frontend change required.
 *
 * See: src/pages/stylists/STYLIST_API_README.md for the full API spec.
 */
import { api } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export const getMyStylistProfile = async () => {
  const { data } = await api.get("/stylist/me");
  return data;
};

export const updateMyStylistProfile = async (payload) => {
  const isFormData = payload instanceof FormData;
  const { data } = await api.patch("/stylist/me", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return data;
};

/* -------------------------------------------------------------------------- */
/* Dashboard / analytics                                                      */
/* -------------------------------------------------------------------------- */

export const getMyDashboard = async (range = "today") => {
  const { data } = await api.get("/stylist/me/dashboard", { params: { range } });
  return data;
};

export const getMyEarnings = async (filters = {}) => {
  const { data } = await api.get("/stylist/me/earnings", { params: filters });
  return data;
};

/* -------------------------------------------------------------------------- */
/* Appointments                                                               */
/* -------------------------------------------------------------------------- */

export const getMyAppointments = async (filters = {}) => {
  const params = {};
  if (filters.status?.length) params.status = filters.status.join(",");
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  const { data } = await api.get("/stylist/me/appointments", { params });
  return data;
};

export const getMyAppointmentById = async (id) => {
  const { data } = await api.get(`/stylist/me/appointments/${id}`);
  return data;
};

export const createMyAppointment = async (payload) => {
  const { data } = await api.post("/stylist/me/appointments", payload);
  return data;
};

export const updateMyAppointment = async (id, payload) => {
  const { data } = await api.patch(`/stylist/me/appointments/${id}`, payload);
  return data;
};

export const updateMyAppointmentStatus = async (id, status, note) => {
  const { data } = await api.patch(`/stylist/me/appointments/${id}/status`, {
    status,
    note,
  });
  return data;
};

/* -------------------------------------------------------------------------- */
/* Clients                                                                    */
/* -------------------------------------------------------------------------- */

export const getMyClients = async (filters = {}) => {
  const { data } = await api.get("/stylist/me/clients", { params: filters });
  return data;
};

/* -------------------------------------------------------------------------- */
/* Availability (personal — distinct from store-level operating hours)        */
/* -------------------------------------------------------------------------- */

export const getMyAvailability = async () => {
  const { data } = await api.get("/stylist/me/availability");
  return data;
};

export const updateMyAvailability = async (payload) => {
  const { data } = await api.patch("/stylist/me/availability", payload);
  return data;
};

export const getMyTimeOff = async () => {
  const { data } = await api.get("/stylist/me/time-off");
  return data;
};

export const createMyTimeOff = async (payload) => {
  const { data } = await api.post("/stylist/me/time-off", payload);
  return data;
};

export const deleteMyTimeOff = async (id) => {
  const { data } = await api.delete(`/stylist/me/time-off/${id}`);
  return data;
};

/* -------------------------------------------------------------------------- */
/* Services (lookup for "Create Appointment" form)                            */
/* -------------------------------------------------------------------------- */

export const getMyServices = async () => {
  const { data } = await api.get("/stylist/me/services");
  return data;
};
