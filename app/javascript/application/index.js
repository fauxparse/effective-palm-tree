import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import history from './lib/history'
import Layout from './components/layout'
import Events from './components/events'
import EventDetails from './components/event_details'

document.addEventListener("DOMContentLoaded", e => {
  ReactDOM.render((
    <Router history={history}>
      <Route path="/" component={Layout}>
        <Route path="events" component={Events}>
          <Route path=":group/:event/:date" component={EventDetails}/>
        </Route>
        <IndexRedirect to="/events"/>
      </Route>
    </Router>
  ), document.body.appendChild(document.createElement('div')))
})
