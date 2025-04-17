import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    return <>

    <Link to={'/auth/register'}>Register</Link>
    </>
}

export default Navbar
