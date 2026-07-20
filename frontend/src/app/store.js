import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import authReducer from "../features/auth/authSlice";

// Per the Dev Guide: Redux Toolkit is reserved for shared app state only
// (auth, profile, cart, wishlist, notifications). Page-specific UI state
// stays local to components. Slices are added here as each feature step
// builds them out.
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    // cart: cartReducer,        // Cart step
    // wishlist: wishlistReducer,// Wishlist step
    // notifications: notificationsReducer, // Messaging/notifications step
  },
});
