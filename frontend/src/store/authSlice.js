import React from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const loginUser = createAsyncThunk("auth/login", async (credentials) => {
  const { data } = await api.post("/api/auth/login", credentials); // ✅ add /api
  localStorage.setItem("token", data.token);
  return data.user;
});

export const signupUser = createAsyncThunk("auth/register", async (userData) => {
  const { data } = await api.post("/api/auth/register", userData); // ✅ add /api
  localStorage.setItem("token", data.token);
  return data.user;
});


const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
