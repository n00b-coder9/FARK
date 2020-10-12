import { combineReducers } from 'redux';
import { drawerSlice } from './slices/drawer';
import { authSlice } from './slices/auth';

export default combineReducers({
  [drawerSlice.name]: drawerSlice.reducer,
  [authSlice.name]: authSlice.reducer,
});
