import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import {Outlet} from 'react-router-dom'

function Layout() {
    return <>
    <Navbar/>
        <Outlet className='min-h-lvh'></Outlet>
    <Footer/>
    </>
}

export default Layout
