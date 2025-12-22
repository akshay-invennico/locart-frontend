import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOrders, updateOrderStatus, getAllProducts, getAllCategories, createEcomOrder, flagOrders, updateProductStatusService, deleteProductService, updateCategoryStatusService, deleteCategoryService, getOrderById, createProductService, bulkUpdateProductStatusService, bulkDeleteProductsService, getProductById, getCategoryById, createCategoryService, updateCategoryService } from "./ecomService";

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



const ecomSlice = createSlice({
  name: "ecomOrders",
  initialState: {
    orders: [],
    products: [],
    categories: [],
    loading: false,
    error: null,
    orderCreated: null,
    selectedOrder: null,
    selectedOrderLoading: false,
    selectedProduct: null,
    selectedProductLoading: false,
    selectedCategory: null,
    selectedCategoryLoading: false,


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
        state.orders = action.payload?.data || [];
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

        state.products = action.payload.data.map(item => ({
          ...item,
          product: {
            name: item.productName,
            profile: item.imageUrls?.[0] ?? "",
          },
          category: item.category?.map(c => c.name).join(", ") || "-",
          price: Number(item.price?.$numberDecimal ?? 0),
        }));

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

        const categoriesArray = action.payload?.data?.categories ?? [];

        state.categories = categoriesArray.map(item => ({
          ...item,
          categoryName: item.categoryName,
          status: item.status,
          productsCount: item.productsCount,
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
      });


  },
});

export default ecomSlice.reducer;
