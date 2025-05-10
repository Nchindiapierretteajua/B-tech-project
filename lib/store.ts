import { configureStore } from "@reduxjs/toolkit";
import servicesReducer from "./features/services/servicesSlice";
import authReducer from "./features/auth/authSlice";
import announcementReducer from "./features/announcements/announcementSlice";

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    auth: authReducer,
    announcements: announcementReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
