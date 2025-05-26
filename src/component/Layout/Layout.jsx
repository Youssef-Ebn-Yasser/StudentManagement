import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import {Outlet} from 'react-router-dom'
import Chatbot from '../Chatbot/Chatbot'

function Layout() {
    return <>
    <Navbar/>
        <Outlet></Outlet>
        <Chatbot />
    <Footer/>
    </>
}

export default Layout
