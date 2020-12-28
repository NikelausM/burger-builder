import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import burgerBuilderReducer from 'store/reducers/burgerBuilder'
import orderReducer from 'store/reducers/order'
import authReducer from 'store/reducers/auth'
import { watchAuth, watchBurgerBuilder, watchOrder } from 'store/sagas/index'

// make redux dev tools only available in development environment
const composeEnhancers = process.env.NODE_ENV === 'development'
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : null
  || compose

const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer
})

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, composeEnhancers(
  // applyMiddleware(thunk)
  applyMiddleware(thunk, sagaMiddleware)
))

const sagaWatchers = [watchAuth, watchBurgerBuilder, watchOrder]
sagaWatchers.forEach(sagaWatcher => sagaMiddleware.run(sagaWatcher));

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(
  <React.StrictMode>
    {app}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
