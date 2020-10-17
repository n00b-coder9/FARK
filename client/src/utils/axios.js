/*
 * This is wrapper for axios for our app
 * This configures axios for making our ajax requests
 * It sets the base url of out API endpoint
 * and, sets auth header when it changes
 *
 * Usage:
 * import axios from 'path/to/this/file/axios.js';
 *
 * All the functions/arguments etc presetn in original axios:
 * axios.post(...);
 * axios.get(...);
 *
 * And some utilities: get/set auth token, get config of set to axios
 * axios.setAuthToken(jwt)
 * jwt = axios.getAuthToken()
 * axiosConfig = axios.getConfig()
 */

import ax from 'axios';

let axios;
// Config for axios
const config = {
  baseURL: `${process.env.NODE_ENV === 'production' ?
        'https://fark.herokuapp.com' :
        'http://localhost:8080'
  }/graphql/`,
  headers: {
    'Authorization': null,
  },
};

axios = ax.create(config);

// Changing auth header
// Immediately configure axios for next request
export const setAuthToken = (token) => {
  config.headers['Authorization'] = token;
  axios = Object.freeze(ax.create(config));
};

// Get auth header
export const getAuthToken = () => config.headers['Authorization'];

// Get config
export const getConfig = () => Object.freeze(config);

export default
{ ...axios, getConfig };
