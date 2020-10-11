import { combineReducers } from 'redux';
import { drawerSlice } from './slices/drawer';

export default combineReducers({
  [drawerSlice.name]: drawerSlice.reducer,
});
