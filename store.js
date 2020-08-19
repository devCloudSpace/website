import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import registerReducer from './src/components/register';
import loginReducer from './src/components/login';
import sessionReducer from './src/components/session';
import createDonationReducer from './src/components/createDonation';
import navbarReducer from './src/components/navbar';

const initialState = {};

const rootReducer = combineReducers({
  register: registerReducer,
  login: loginReducer,
  session: sessionReducer,
  createDonation: createDonationReducer,
  navbar: navbarReducer,
});

const middlewares = [thunk];
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares));

export default store;
