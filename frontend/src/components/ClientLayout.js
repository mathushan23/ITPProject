import React from 'react'
import Navbar1 from './usernavbar'
import { Outlet } from 'react-router-dom'

const ClientLayout = () => {
  return (
    <div>
      <Navbar1 />
      <Outlet />
    </div>
  )
}

export default ClientLayout
