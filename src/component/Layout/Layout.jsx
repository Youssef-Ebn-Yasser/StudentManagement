import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import {Outlet} from 'react-router-dom'
import Chatbot from '../Chatbot/Chatbot'
import Translate from '../Translate/Translate'
import styled from 'styled-components'
import Loader from '../Loader/Loader'
import ContentWrapper from '../ContentWrapper/ContentWrapper'


function Layout() {

      const [loading, setLoading] = useState(false);

    return <>
    <Loader visible={loading}/>
        <ContentWrapper $loading={loading}>
            <Navbar/>
        <Outlet context={{ setLoading }}></Outlet>
        <Chatbot/>
    <Footer/>
        </ContentWrapper>
    
    </>
}

export default Layout
