import galleryReducer from './gallery';

import { combineReducers } from 'redux';

const rootReducer = (combineReducers as any)({
  galleryReducer
});

export default rootReducer;