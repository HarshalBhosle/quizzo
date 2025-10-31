import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./quizSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    quiz: quizReducer,
    auth: authReducer,
  },
});

export default store;
