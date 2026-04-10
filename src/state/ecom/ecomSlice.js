import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOrders, updateOrderStatus, getAllProducts, getAllCategories, createEcomOrder, flagOrders, updateProductStatusService, deleteProductService, updateCategoryStatusService, deleteCategoryService, getOrderById, createProductService, bulkUpdateProductStatusService, bulkDeleteProductsService, getProductById, getCategoryById, createCategoryService, updateCategoryService, updateProductService, getAllVendors, getVendorById, createVendorService, updateVendorService, deleteVendorService, toggleVendorStatusService, getAllOffers, getOfferById, createOfferService, updateOfferService, deleteOfferService, bulkDeleteOffersService, updateOfferStatusService } from "./ecomService";

export const fetchAllOrders = createAsyncThunk(
  "ecom/fetchAllOrders",
  async (filters, thunkAPI) => {
    try {
      const data = await getAllOrders(filters);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const patchOrderStatus = createAsyncThunk(
  "ecom/patchOrderStatus",
  async ({ orderIds, status }, thunkAPI) => {
    try {
      const data = await updateOrderStatus(orderIds, status);
      return { orderIds, status, data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const patchFlagOrders = createAsyncThunk(
  "ecom/patchFlagOrders",
  async ({ orderIds, reason }, { rejectWithValue }) => {
    try {
      const data = await flagOrders(orderIds, reason);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "ecom/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await getOrderById(orderId);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "ecom/fetchAllProducts",
  async (filters, thunkAPI) => {
    try {
      const data = await getAllProducts(filters);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "ecom/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await getProductById(productId);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createProduct = createAsyncThunk(
  "ecom/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await createProductService(formData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "ecom/updateProduct",
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const data = await updateProductService(productId, formData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);


export const updateProductStatus = createAsyncThunk(
  "ecom/updateProductStatus",
  async ({ productId, status }, { rejectWithValue }) => {
    try {
      const data = await updateProductStatusService(productId, status);
      return { productId, status: data.data.status };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "ecom/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await deleteProductService(productId);
      return { productId, message: data.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "ecom/fetchAllCategories",
  async (filters, thunkAPI) => {
    try {
      const data = await getAllCategories(filters);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "ecom/fetchCategoryById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const data = await getCategoryById(categoryId);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createCategory = createAsyncThunk(
  "ecom/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createCategoryService(payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);



export const bulkUpdateProductStatus = createAsyncThunk(
  "ecom/bulkUpdateProductStatus",
  async ({ productIds, status }, { rejectWithValue }) => {
    try {
      const data = await bulkUpdateProductStatusService(productIds, status);
      return { productIds, status };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const bulkDeleteProducts = createAsyncThunk(
  "ecom/bulkDeleteProducts",
  async ({ productIds }, { rejectWithValue }) => {
    try {
      const data = await bulkDeleteProductsService(productIds);
      return { productIds };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);


export const updateCategoryStatus = createAsyncThunk(
  "ecom/updateCategoryStatus",
  async ({ categoryId, status }, { rejectWithValue }) => {
    try {
      const normalized = typeof status === "string" ? status.toLowerCase() : status;
      const data = await updateCategoryStatusService(categoryId, normalized);
      return { categoryId, status: data?.data?.status ?? data?.status ?? normalized };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);


export const updateCategory = createAsyncThunk(
  "ecom/updateCategory",
  async ({ categoryId, payload }, { rejectWithValue }) => {
    try {
      const data = await updateCategoryService(categoryId, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "ecom/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const data = await deleteCategoryService(categoryId);
      return { categoryId, message: data.message };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createOrder = createAsyncThunk(
  "ecom/createEcomOrder",
  async (payload, thunkAPI) => {
    try {
      const data = await createEcomOrder(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);



// ── Vendor Thunks ──

export const fetchAllVendors = createAsyncThunk(
  "ecom/fetchAllVendors",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await getAllVendors(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  "ecom/fetchVendorById",
  async (vendorId, { rejectWithValue }) => {
    try {
      const data = await getVendorById(vendorId);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createVendor = createAsyncThunk(
  "ecom/createVendor",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await createVendorService(formData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateVendor = createAsyncThunk(
  "ecom/updateVendor",
  async ({ vendorId, formData }, { rejectWithValue }) => {
    try {
      const data = await updateVendorService(vendorId, formData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteVendorAction = createAsyncThunk(
  "ecom/deleteVendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      await deleteVendorService(vendorId);
      return { vendorId };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const toggleVendorStatus = createAsyncThunk(
  "ecom/toggleVendorStatus",
  async (vendorId, { rejectWithValue }) => {
    try {
      const data = await toggleVendorStatusService(vendorId);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── Offer Thunks ──

export const fetchAllOffers = createAsyncThunk(
  "ecom/fetchAllOffers",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await getAllOffers(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchOfferById = createAsyncThunk(
  "ecom/fetchOfferById",
  async (offerId, { rejectWithValue }) => {
    try {
      const data = await getOfferById(offerId);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createOffer = createAsyncThunk(
  "ecom/createOffer",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createOfferService(payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateOffer = createAsyncThunk(
  "ecom/updateOffer",
  async ({ offerId, payload }, { rejectWithValue }) => {
    try {
      const data = await updateOfferService(offerId, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteOfferAction = createAsyncThunk(
  "ecom/deleteOffer",
  async (offerId, { rejectWithValue }) => {
    try {
      await deleteOfferService(offerId);
      return { offerId };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const bulkDeleteOffers = createAsyncThunk(
  "ecom/bulkDeleteOffers",
  async (offerIds, { rejectWithValue }) => {
    try {
      const data = await bulkDeleteOffersService(offerIds);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateOfferStatus = createAsyncThunk(
  "ecom/updateOfferStatus",
  async ({ offerId, status }, { rejectWithValue }) => {
    try {
      const data = await updateOfferStatusService(offerId, status);
      return data.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const ecomSlice = createSlice({
  name: "ecomOrders",
  initialState: {
    orders: [],
    products: [],
    categories: [],
    vendors: [],
    loading: false,
    error: null,
    orderCreated: null,
    selectedOrder: null,
    selectedOrderLoading: false,
    selectedProduct: null,
    selectedProductLoading: false,
    selectedCategory: null,
    selectedCategoryLoading: false,
    selectedVendor: null,
    selectedVendorLoading: false,
    vendorLoading: false,
    offers: [],
    offerLoading: false,
    selectedOffer: null,
    selectedOfferLoading: false,
    offerPagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      limit: 10,
    },
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      limit: 10,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        const { data, pagination } = action.payload || {};

        state.orders = Array.isArray(data) ? data : [];

        if (pagination) {
          const { page, per_page, total } = pagination;
          state.pagination = {
            page: page || 1,
            limit: per_page || 10,
            total: total || 0,
            totalPages: Math.ceil((total || 0) / (per_page || 10)) || 1
          };
        } else {
          state.pagination = {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1
          };
        }
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.selectedOrderLoading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrderLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.selectedOrderLoading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderCreated = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderCreated = action.payload;
        if (action.payload?.data) {
          state.orders.unshift(action.payload.data);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderCreated = null;
      })
      .addCase(patchOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchOrderStatus.fulfilled, (state, action) => {
        const { orderIds, status } = action.payload;
        state.orders = state.orders.map((order) =>
          order.orderId && orderIds.includes(order.orderId)
            ? { ...order, orderStatus: status.toLowerCase() }
            : order
        );
      })
      .addCase(patchOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.selectedProductLoading = true;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProductLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedProductLoading = false;
        state.selectedProduct = null;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift({
          ...action.payload,
          product: {
            name: action.payload.productName,
            profile: action.payload.imageUrls?.[0] ?? "",
          },
          category: action.payload.category?.map((c) => c.name).join(", ") || "-",
          price: Number(action.payload.price?.$numberDecimal ?? 0),
        });
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { productId, status } = action.payload;
        state.products = state.products.map((prod) =>
          prod._id === productId ? { ...prod, status: status.toLowerCase() } : prod
        );
        state.loading = false;
      })
      .addCase(updateProductStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p._id !== action.payload.productId
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(patchFlagOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchFlagOrders.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(patchFlagOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        const { data, page, limit, totalPages, total } = action.payload || {};

        state.products = (Array.isArray(data) ? data : []).map(item => ({
          ...item,
          product: {
            name: item.productName,
            profile: item.imageUrls?.[0] ?? "",
          },
          category: item.category?.map(c => c.name).join(", ") || "-",
          price: Number(item.price?.$numberDecimal ?? 0),
        }));

        if (page !== undefined && total !== undefined) {
          state.pagination = {
            page: page || 1,
            limit: limit || 10,
            total: total || 0,
            totalPages: totalPages || 1
          };
        } else {
          state.pagination = {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1
          };
        }
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;

        const { categories, total, page, limit } = action.payload?.data || {};

        state.pagination = {
          page: page || 1,
          limit: limit || 10,
          total: total || 0,
          totalPages: Math.ceil((total || 0) / (limit || 10)) || 1
        };

        state.categories = (categories || []).map(item => ({
          ...item,
          categoryName: item.categoryName,
          status: item.status,
          productsCount: item.itemsCount,
          createdAt: item.createdAt,
        }));
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategoryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        const { categoryId, status } = action.payload;
        state.categories = state.categories.map((cat) =>
          cat._id === categoryId ? { ...cat, status: status.toLowerCase() } : cat
        );
        state.loading = false;
      })
      .addCase(updateCategoryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload.categoryId
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.selectedCategoryLoading = true;
        state.selectedCategory = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedCategoryLoading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.selectedCategoryLoading = false;
        state.selectedCategory = null;
        state.error = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;

        const newCategory = {
          ...action.payload,
          categoryName: action.payload.categoryName,
          status: action.payload.status,
          productsCount: action.payload.productsCount || 0,
          createdAt: action.payload.createdAt
        };
        state.categories.unshift(newCategory);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bulkUpdateProductStatus.fulfilled, (state, action) => {
        const { productIds, status } = action.payload;
        state.products = state.products.map(prod =>
          productIds.includes(prod._id)
            ? { ...prod, status }
            : prod
        );
      })
      .addCase(bulkDeleteProducts.fulfilled, (state, action) => {
        const { productIds } = action.payload;
        state.products = state.products.filter(
          (prod) => !productIds.includes(prod._id)
        );
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;

        state.categories = state.categories.map(cat =>
          cat._id === action.payload._id
            ? { ...cat, ...action.payload }
            : cat
        );

        state.selectedCategory = action.payload;
      })

      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ── Vendor Reducers ──
      .addCase(fetchAllVendors.pending, (state) => {
        state.vendorLoading = true;
        state.error = null;
      })
      .addCase(fetchAllVendors.fulfilled, (state, action) => {
        state.vendorLoading = false;
        const vendors = action.payload?.data || [];
        state.vendors = (Array.isArray(vendors) ? vendors : []).map((v) => ({
          ...v,
          status: v.isActive ? "active" : "inactive",
        }));
      })
      .addCase(fetchAllVendors.rejected, (state, action) => {
        state.vendorLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchVendorById.pending, (state) => {
        state.selectedVendorLoading = true;
        state.selectedVendor = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.selectedVendorLoading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.selectedVendorLoading = false;
        state.error = action.payload;
      })
      .addCase(createVendor.pending, (state) => {
        state.vendorLoading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.vendorLoading = false;
        state.vendors.unshift({
          ...action.payload,
          status: action.payload.isActive ? "active" : "inactive",
        });
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.vendorLoading = false;
        state.error = action.payload;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.vendorLoading = false;
        state.vendors = state.vendors.map((v) =>
          v._id === action.payload._id
            ? { ...action.payload, status: action.payload.isActive ? "active" : "inactive" }
            : v
        );
      })
      .addCase(deleteVendorAction.pending, (state) => {
        state.vendorLoading = true;
        state.error = null;
      })
      .addCase(deleteVendorAction.fulfilled, (state, action) => {
        state.vendorLoading = false;
        state.vendors = state.vendors.filter((v) => v._id !== action.payload.vendorId);
      })
      .addCase(deleteVendorAction.rejected, (state, action) => {
        state.vendorLoading = false;
        state.error = action.payload;
      })
      .addCase(toggleVendorStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.vendors = state.vendors.map((v) =>
          v._id === updated._id
            ? { ...updated, status: updated.isActive ? "active" : "inactive" }
            : v
        );
      })
      // ── Offer Reducers ──
      .addCase(fetchAllOffers.pending, (state) => {
        state.offerLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.offerLoading = false;
        const { data, pagination } = action.payload || {};
        state.offers = Array.isArray(data) ? data : [];
        if (pagination) {
          state.offerPagination = {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            total: pagination.total || 0,
            totalPages: pagination.totalPages || 1,
          };
        }
      })
      .addCase(fetchAllOffers.rejected, (state, action) => {
        state.offerLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOfferById.pending, (state) => {
        state.selectedOfferLoading = true;
        state.selectedOffer = null;
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.selectedOfferLoading = false;
        state.selectedOffer = action.payload;
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.selectedOfferLoading = false;
        state.error = action.payload;
      })
      .addCase(createOffer.pending, (state) => {
        state.offerLoading = true;
        state.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.offerLoading = false;
        state.offers.unshift(action.payload);
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.offerLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.offerLoading = false;
        state.offers = state.offers.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      })
      .addCase(deleteOfferAction.pending, (state) => {
        state.offerLoading = true;
        state.error = null;
      })
      .addCase(deleteOfferAction.fulfilled, (state, action) => {
        state.offerLoading = false;
        state.offers = state.offers.filter((o) => o._id !== action.payload.offerId);
      })
      .addCase(deleteOfferAction.rejected, (state, action) => {
        state.offerLoading = false;
        state.error = action.payload;
      })
      .addCase(bulkDeleteOffers.fulfilled, (state, action) => {
        const deletedIds = action.payload?.deleted || [];
        state.offers = state.offers.filter((o) => !deletedIds.includes(o._id));
      })
      .addCase(updateOfferStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.offers = state.offers.map((o) =>
          o._id === updated._id ? updated : o
        );
      });

  },
});

export default ecomSlice.reducer;
