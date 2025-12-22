import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllAppointments, getAppointmentDetails, getRefundSummary, updateAppointment as updateAppointmentApi, createAppointment, updateAppointmentStatus as updateAppointmentStatusApi, initiateRefund } from "./appointmentService";


export const fetchAllAppointments = createAsyncThunk(
    "appointment/fetchAllAppointments",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await getAllAppointments(filters);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching appointments");
        }
    }
);

export const fetchAppointmentDetails = createAsyncThunk(
    "appointment/fetchAppointmentDetails",
    async (appointmentId, { rejectWithValue }) => {
        try {
            const response = await getAppointmentDetails(appointmentId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching appointment details");
        }
    }
);

export const fetchRefundSummary = createAsyncThunk(
    "appointment/fetchRefundSummary",
    async (appointmentId, { rejectWithValue }) => {
        try {
            const response = await getRefundSummary(appointmentId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching refund summary");
        }
    }
);

export const updateAppointment = createAsyncThunk(
    "appointment/updateAppointment",
    async ({ appointmentId, payload }, { rejectWithValue }) => {
        try {
            const response = await updateAppointmentApi(appointmentId, payload);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error updating appointment");
        }
    }
);

export const addAppointment = createAsyncThunk(
    "appointment/addAppointment",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createAppointment(payload);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error creating appointment");
        }
    }
);

export const updateAppointmentStatus = createAsyncThunk(
    "appointment/updateStatus",
    async ({ bookingIds, status, reason }, { rejectWithValue }) => {
        try {
            const payload = { bookingIds, status };
            if (reason) payload.reason = reason;

            const response = await updateAppointmentStatusApi(payload);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Status update failed");
        }
    }
);


export const confirmRefundThunk = createAsyncThunk(
    "appointment/confirmRefund",
    async ({ appointmentId, confirm_amount, remarks }, { rejectWithValue }) => {
        try {
            const res = await initiateRefund(appointmentId, {
                confirm_amount,
                remarks,
            });
            return res;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Refund failed");
        }
    }
);

const appointmentSlice = createSlice({
    name: "appointment",
    initialState: {
        data: [],
        selectedAppointment: null,
        loading: false,
        error: null,
        refundSummary: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAppointments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.data = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload?.data || [];
            })
            .addCase(fetchAllAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAppointmentDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAppointmentDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedAppointment = action.payload?.data || action.payload;
            })
            .addCase(fetchAppointmentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchRefundSummary.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRefundSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.refundSummary = action.payload;
            })
            .addCase(fetchRefundSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAppointment.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAppointment.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload?.data || action.payload;
                state.selectedAppointment = updated;
                const bookingId = updated?.booking_id || updated?.id;
                if (bookingId && Array.isArray(state.data)) {
                    state.data = state.data.map((item) =>
                        (item.booking_id === bookingId || item.id === bookingId)
                            ? { ...item, ...updated }
                            : item
                    );
                }
            })
            .addCase(updateAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addAppointment.pending, (state) => {
                state.loading = true;
            })
            .addCase(addAppointment.fulfilled, (state, action) => {
                state.loading = false;
                const created = action.payload?.data || action.payload;
                state.data = [created, ...state.data];
            })
            .addCase(addAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAppointmentStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
                state.loading = false;

                const updatedItems = action.payload?.data || [];

                if (Array.isArray(state.data)) {
                    state.data = state.data.map(item => {
                        const match = updatedItems.find(u =>
                            u.booking_id === item.booking_id || u.id === item.id
                        );
                        return match ? { ...item, ...match } : item;
                    });
                }
            })
            .addCase(updateAppointmentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(confirmRefundThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(confirmRefundThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.refundConfirmation = action.payload;
            })
            .addCase(confirmRefundThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });


    },
});

export default appointmentSlice.reducer;
