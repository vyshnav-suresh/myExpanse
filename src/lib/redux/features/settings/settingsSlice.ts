// store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const getAmount: any = localStorage.getItem("maxAmount");
const initialMaxAMount = JSON.parse(getAmount);
const initialState = {
  theme: "light",
  maxAmount: initialMaxAMount,
};

const settingsSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    updateMaxAmount: (state, action) => {
      state.maxAmount = action.payload;
      localStorage.setItem("maxAmount", action.payload);
      toast.success("Max Amount Updated Sccessfully");
    },
  },
});

export const { toggleTheme, updateMaxAmount } = settingsSlice.actions;

export default settingsSlice.reducer;
