import React from 'react'
import Header from './header'
import Sidebar from './sidebar'

const Layout = ({ children }) => (
  <div className="application">
    <Sidebar />
    <main>
      {children}
    </main>
  </div>
)

export default Layout
