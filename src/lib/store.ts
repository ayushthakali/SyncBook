import { configureStore } from "@reduxjs/toolkit";
import { taskSlice } from "./features/tasks/taskSlice";
import authReducer from "./features/auth/authSlice";
import uiSlice from "./features/ui/uiSlice";
import { apiSlice } from "./features/api/apiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      tasks: taskSlice.reducer,
      ui: uiSlice.reducer,
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>; //type returned by makeStore, i.e., the type of the Redux store object. This type includes dispatch, getState, subscribe, etc.
export type RootState = ReturnType<AppStore["getState"]>; //extracts the type that getState() returns i.e. the main state
export type AppDispatch = AppStore["dispatch"]; //type of dispatch function
