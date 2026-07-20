import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

const ACCESS_KEY = "velora_access_token";
const REFRESH_KEY = "velora_refresh_token";

function persistTokens(tokens) {
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// --- Thunks -----------------------------------------------------------

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.register(payload);
      persistTokens(data.tokens);
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.errors || { detail: "Registration failed." },
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.login(payload);
      persistTokens(data.tokens);
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.errors || { detail: "Login failed." },
      );
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.me();
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  const refresh = localStorage.getItem(REFRESH_KEY);
  try {
    if (refresh) await authService.logout(refresh);
  } finally {
    clearTokens();
  }
});

// --- Slice --------------------------------------------------------------

const initialState = {
  user: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  isAuthenticated: Boolean(localStorage.getItem(ACCESS_KEY)),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Fetch current user (used on app load to hydrate session)
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
