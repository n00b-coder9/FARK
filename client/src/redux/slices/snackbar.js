import { createSlice } from '@reduxjs/toolkit';

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: { isOpen: false, message: '', severity: 'info' },
  reducers: {
    setIsSnackbarOpen: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { setIsSnackbarOpen } = snackbarSlice.actions;
