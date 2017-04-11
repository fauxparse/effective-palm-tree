import React from 'react'
import MenuButton from './menu_button'
import Sidebar from './sidebar'

const Layout = ({ children, location }) => (
  <div className="application">
    <Sidebar />
    <main>
      {children}
    </main>
    <MenuButton location={location} />
  </div>
)

export default Layout
