'use client'
import { configureStore } from '@reduxjs/toolkit';
import currentUserSlice from "./slices/currentUserSlice";

export const makeStore = configureStore({
  reducer: {
    currentUser: currentUserSlice,
  },
})
