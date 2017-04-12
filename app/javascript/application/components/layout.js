import React from 'react'
import MenuButton from './menu_button'
import Sidebar from './sidebar'

const Layout = ({ children, location, routes }) => (
  <div className="application">
    <Sidebar />
    <main>
      {children}
    </main>
    <MenuButton location={location} routes={routes} />
  </div>
)

export default Layout
