import { configureStore } from "@reduxjs/toolkit"
import servicesReducer from "./features/services/servicesSlice"
import authReducer from "./features/auth/authSlice"

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

