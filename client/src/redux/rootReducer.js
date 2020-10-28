import { combineReducers } from 'redux';
import { drawerSlice } from './slices/drawer';
import { authSlice } from './slices/auth';
import { snackbarSlice } from './slices/snackbar';
import { urlSlice } from './slices/urls';
export default combineReducers({
  [drawerSlice.name]: drawerSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [snackbarSlice.name]: snackbarSlice.reducer,
  [urlSlice.name]: urlSlice.reducer,
});
