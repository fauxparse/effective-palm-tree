import React from 'react'
import ReactDOM from 'react-dom'
import Header from './components/header'
import Sidebar from './components/sidebar'
import Calendar from './components/calendar'

class Application extends React.Component {
  render() {
    return (
      <div className="application">
        <Sidebar/>
        <main>
          <Header title="Hello world"/>
          <Calendar/>
        </main>
      </div>
    )
  }
}

document.addEventListener("DOMContentLoaded", e => {
  ReactDOM.render(
    <Application/>,
    document.body.appendChild(document.createElement('div'))
  )
})
