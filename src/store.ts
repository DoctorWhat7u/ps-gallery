/**
 * @fileoverview Performs setup tasks for the redux store (application state) with
 * middle ware for devtools console logging and asyncronous actions.
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer  from './reducers';

const configStore = (initialState: any = {}) => 
    createStore(rootReducer, initialState, applyMiddleware(logger, thunk));

export { configStore };