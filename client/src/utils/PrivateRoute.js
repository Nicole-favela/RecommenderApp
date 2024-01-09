import React from 'react'
import {Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'


export const PrivateRoute = ({children}) => {
 
  const token = Cookies.get('token')
  const user = true //for testing
    
  return (
    token ? children : <Navigate to= "/login"/>
  )
}
