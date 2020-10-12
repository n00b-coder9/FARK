import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import loginQuery from '../../graphQl/queries/loginQuery';

import signupQuery from '../../graphQl/queries/signupQuery';
import axios from '../../utils/axios';

import { SINGUP, LOGIN } from '../actionTypes';

export const signup = createAsyncThunk(SINGUP,
    async (userData) => {
      const graphqlQuery = signupQuery(userData);
      const response = await axios().post('/', JSON.stringify(graphqlQuery));
      await response.json();
    });

export const login = createAsyncThunk(LOGIN,
    async (userData) => {
      const graphqlQuery = loginQuery(userData);
      const response = await axios().post('/', JSON.stringify(graphqlQuery));
      const loginData = await response.json();
      return loginData.token;
    });

export const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, isLoggedIn: false, user: null },
  reducers: {
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
      state.user = jwtDecode(action.payload);
    },
  },
});
