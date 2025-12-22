import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStylists, getStylistsById, createStylist, deleteStylistById, updateStylistService } from "@/state/stylist/stylistService";


export const fetchStylists = createAsyncThunk(
    "stylists/fetchStylists",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllStylists();
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch stylists"
            );
        }
    }
);

export const fetchStylistsById = createAsyncThunk(
    "stylists/fetchStylistsById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getStylistsById(id);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch stylists"
            );
        }
    }
);

export const addStylist = createAsyncThunk(
    "stylists/addStylist",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createStylist(data);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add stylist"
            );
        }
    }
);

export const updateStylist = createAsyncThunk(
    "stylists/updateStylist",
    async (data, { rejectWithValue }) => {
        try {
            const response = await updateStylistService(data.id, data);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update stylist"
            );
        }
    }
);

export const removeStylist = createAsyncThunk(
    "stylists/removeStylist",
    async (id, { rejectWithValue }) => {
        try {
            const res = await deleteStylistById(id);
            return res.data?.data?._id;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to delete stylist");
        }
    }
);



const stylistSlice = createSlice({
    name: "stylists",
    initialState: {
        stylists: [],
        stylist: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearStylistError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStylists.fulfilled, (state, action) => {
                state.loading = false;
                state.stylists = action.payload?.data?.stylists || [];
            })
            .addCase(fetchStylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchStylistsById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStylistsById.fulfilled, (state, action) => {
                state.loading = false;
                state.stylist = action.payload?.stylist || null;
            })
            .addCase(fetchStylistsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addStylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addStylist.fulfilled, (state, action) => {
                state.loading = false;
                const newStylist = action.payload?.stylist;
                if (newStylist) state.stylists.push(newStylist);
            })
            .addCase(addStylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeStylist.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeStylist.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;
                state.stylists = state.stylists.filter(
                    (stylist) => stylist._id !== deletedId
                );
            })
            .addCase(removeStylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export const { clearStylistError } = stylistSlice.actions;
export default stylistSlice.reducer;
