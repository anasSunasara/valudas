import React from 'react'
import Dashboard from '../components/admin/Dashboard'
import Service from '@/components/admin/Service'
import Tecnology from './admin/Tecnology'
import Portfolio  from '../components/admin/Portfolio'

function index() {
  return (
    <>
    <Dashboard/>
    <Service/>
    <Tecnology/>
    <Portfolio/>

      
    </>
  )
}

export default index
