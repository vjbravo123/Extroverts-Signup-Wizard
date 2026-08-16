import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './slices/signupSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      signup: signupReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];