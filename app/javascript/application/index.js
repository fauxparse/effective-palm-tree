import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import history from './lib/history'
import reducer from './reducers'
import { reactiveQueryMiddleware } from './lib/reactive_query'
import Security from './components/security'
import Events from './components/events'
import Groups from './components/groups'
import Members from './components/members'

const store = createStore(
  reducer,
  applyMiddleware(
    reactiveQueryMiddleware,
    thunk,
    routerMiddleware(history)
  )
)

document.addEventListener("DOMContentLoaded", e => {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={syncHistoryWithStore(history, store)}>
        <Route path="/" component={Security}>
          <Route path="events" component={Events.Index}>
            <Route path=":group/:event/:date" component={Events.Show}/>
          </Route>
          <Route path="groups" component={Groups.Index}>
            <Route path=":groupId" component={Groups.Show}>
              <Route path="members" component={Members.Index}>
                <Route path=":memberId" component={Members.Show} />
              </Route>
            </Route>
          </Route>
          <IndexRedirect to="/events"/>
        </Route>
      </Router>
    </Provider>
  ), document.body.appendChild(document.createElement('div')))
})
