import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { HashRouter, Route } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import App from './containers/App';

import reducers from './reducers';
const storeWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = storeWithMiddleware(reducers);

import '../css/index.css';

const routes = (
  <Provider store={store}>
    <HashRouter>
      <Route path="/" component={App} />
    </HashRouter>
  </Provider>
);

ReactDOM.render(
  routes,
  document.getElementById('root')
);
