import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cartService } from "../../services/cartService";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  return await cartService.get();
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue, dispatch }) => {
    try {
      const data = await cartService.add(productId, quantity);
      await dispatch(fetchCart());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Couldn't add to cart.");
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const data = await cartService.updateQuantity(itemId, quantity);
      await dispatch(fetchCart());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Couldn't update quantity.");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (itemId, { dispatch }) => {
    await cartService.remove(itemId);
    await dispatch(fetchCart());
  }
);

const initialState = {
  items: [],
  total: "0",
  itemCount: 0,
  status: "idle",
  error: null,
  lastAddedMessage: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError(state) {
      state.error = null;
    },
    clearCartState(state) {
      // Called on logout so the next user's session doesn't briefly
      // show the previous buyer's cart before a fresh fetch completes.
      state.items = [];
      state.total = "0";
      state.itemCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.item_count;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.error = null;
        state.lastAddedMessage = "Added to cart.";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCartError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
