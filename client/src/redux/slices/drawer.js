import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { FETCH_IS_DRAWER_OPEN, SET_IS_DRAWER_OPEN } from '../actionTypes';

const localStorageIsDrawerOpenKey = 'isDrawerOpen';

// Set the open/close state of the drawer
export const setIsDrawerOpen = createAsyncThunk(SET_IS_DRAWER_OPEN,
    (isDrawerOpen) => {
      localStorage.setItem(localStorageIsDrawerOpenKey, isDrawerOpen);
      return isDrawerOpen;
    });

export const fetchIsDrawerOpen = createAsyncThunk(FETCH_IS_DRAWER_OPEN,
    () => {
      return Boolean(localStorage.getItem(localStorageIsDrawerOpenKey) === 'true');
    });

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState: { isOpen: false },
  reducers: {
  },
  extraReducers: {
    [setIsDrawerOpen.fulfilled]: (state, action) => {
      state.isOpen = action.payload;
    },
    [fetchIsDrawerOpen.fulfilled]: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});
