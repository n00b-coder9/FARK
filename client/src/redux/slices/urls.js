import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getUrlsQuery from '../../graphQl/queries/getUrlsQuery';
import axios from '../../utils/axios';

import { FETCH_URLS } from '../actionTypes';

export const fetchUrls = createAsyncThunk(FETCH_URLS,
    async (payload) => {
      try {
        const { token } = payload;
        const graphqlQuery = getUrlsQuery();
        const response = await axios.post('/', graphqlQuery, {
          headers: {
            Authorization: token,
          },
        });
        const urls = response.data.data.getUrls.urls;
        return { urls };
      } catch (err) {
        return { urls: [] };
      }
    });
export const urlSlice = createSlice({
  name: 'urls',
  initialState: { urls: [] },
  extraReducers: {
    [fetchUrls.fulfilled]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
});
