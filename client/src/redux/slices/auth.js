import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

import loginQuery from '../../graphQl/queries/loginQuery';
import axios from '../../utils/axios';

import { LOGIN } from '../actionTypes';

export const login = createAsyncThunk(LOGIN,
    async (userData) => {
      const graphqlQuery = loginQuery(userData);
      const response = await axios().post('/', graphqlQuery);
      return response.data;
    });

export const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, isLoggedIn: false, user: null },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
      state.user = jwtDecode(action.payload);
    },
  },
});
