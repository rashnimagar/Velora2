import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  isMobileNavOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleMobileNav(state) {
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },
    closeMobileNav(state) {
      state.isMobileNavOpen = false;
    },
  },
});

export const { toggleSidebar, toggleMobileNav, closeMobileNav } = uiSlice.actions;
export default uiSlice.reducer;
