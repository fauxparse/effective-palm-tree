import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import history from './lib/history'
import reducer from './reducers'
import Layout from './components/layout'
import Events from './components/events'
import EventDetails from './components/event_details'

const store = createStore(
  reducer,
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(history))
)

document.addEventListener("DOMContentLoaded", e => {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={syncHistoryWithStore(history, store)}>
        <Route path="/" component={Layout}>
          <Route path="events" component={Events}>
            <Route path=":group/:event/:date" component={EventDetails}/>
          </Route>
          <IndexRedirect to="/events"/>
        </Route>
      </Router>
    </Provider>
  ), document.body.appendChild(document.createElement('div')))
})
