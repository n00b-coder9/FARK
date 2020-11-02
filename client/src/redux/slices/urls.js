import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getUrlsQuery from '../../graphQl/queries/getUrlsQuery';
import axios from '../../utils/axios';

import { FETCH_URLS, SET_SELECTED_URL } from '../actionTypes';

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

export const setSelectedUrl = createAsyncThunk(SET_SELECTED_URL,
    async (payload) => {
      const { selectedUrl } = payload;
      localStorage.setItem('selectedUrlId', selectedUrl._id);
      return {
        selectedUrl,
      };
    });

export const urlSlice = createSlice({
  name: 'urls',
  initialState: { urls: [], selectedUrl: null },
  extraReducers: {
    [fetchUrls.fulfilled]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [setSelectedUrl.fulfilled]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
});
