import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import checksReducer from '../features/checks/checksSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer, // add more slices later
    checks: checksReducer,
  },
});
