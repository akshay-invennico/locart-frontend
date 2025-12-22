import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../state/auth/authSlice";
import dashboardReducer from "../state/dashboard/dashboardSlice";
import ecomOrderReducer from "./ecom/ecomSlice";
import appointmentReducer from "../state/appointment/appointmentSlice";
import stylistReducer from "../state/stylist/stylistSlice";
import storeReducer from "../state/store/storeSlice";
import clientReducer from "../state/client/clientSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    ecomOrders: ecomOrderReducer,
    appointment: appointmentReducer,
    stylists: stylistReducer,
    salon: storeReducer,
    client: clientReducer,
  },
});
