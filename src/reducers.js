import { combineReducers } from 'redux';
import data from  './reducers/data-reducer';
import finished from './reducers/finished-reducer';
import headers from './reducers/headers-reducer';
import upload from './reducers/upload-reducer';
export default combineReducers({
  data,
  finished,
  headers,
  upload
})
