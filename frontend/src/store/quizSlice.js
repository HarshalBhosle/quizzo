import React from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchQuizzes = createAsyncThunk("quiz/fetchAll", async () => {
  const { data } = await api.get("/quiz");
  return data;
});

const quizSlice = createSlice({
  name: "quiz",
  initialState: { quizzes: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => { state.loading = true; })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default quizSlice.reducer;
