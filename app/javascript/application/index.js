import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect, hashHistory } from 'react-router'
import Layout from './components/layout'
import Events from './components/events'
import EventDetails from './components/event_details'

document.addEventListener("DOMContentLoaded", e => {
  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={Layout}>
        <Route path="events" component={Events}>
          <Route path=":id" component={EventDetails}/>
        </Route>
        <IndexRedirect to="/events"/>
      </Route>
    </Router>
  ), document.body.appendChild(document.createElement('div')))
})
