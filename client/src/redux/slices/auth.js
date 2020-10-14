import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

import { setAuthToken } from '../../utils/axios';

import { LOGIN, FETCH_LOGIN } from '../actionTypes';

export const setLogin = createAsyncThunk(LOGIN,
    async (payload) => {
      const { isLoggedIn, authToken } = payload;
      localStorage.setItem('authToken', authToken);
      setAuthToken(authToken);
      return {
        isLoggedIn, authToken, user: authToken !== null ? jwtDecode(authToken) : null,
      };
    });

export const fetchLogin = createAsyncThunk(FETCH_LOGIN,
    async () => {
      const authToken = localStorage.getItem('authToken');
      return {
        isLoggedIn: !(authToken === null || authToken === 'null'),
        authToken,
        user: (!(authToken === null || authToken === 'null'))? jwtDecode(authToken) : null,
      };
    });

export const authSlice = createSlice({
  name: 'auth',
  initialState: { authToken: null, isLoggedIn: null, user: null },
  extraReducers: {
    [setLogin.fulfilled]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [fetchLogin.fulfilled]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
});
