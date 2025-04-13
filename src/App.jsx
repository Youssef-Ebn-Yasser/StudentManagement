import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './component/Layout/Layout'
import Login from './component/Login/Login'
import Register from './component/Register/Register'
import Home from './component/Home/Home'
import Profile from './component/Profile/Profile'
import Dashboard from './component/Dashboard/Dashboard'

let routers = createBrowserRouter([
  {path:'' , element:<Layout/> , children:[
    {index:true , element:<Home/>},
    {path:'login' , element:<Login/>},
    {path:'register' , element:<Register/>},
    {path:'profile' , element:<Profile/>},
    {path:'dashboard' , element:<Dashboard/>},
    {path:'*' , element:<Notfound/>}
  ]}
])

function App() {

  return <>
  <RouterProvider router={routers}></RouterProvider>
  </>
}

export default App
