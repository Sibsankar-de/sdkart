import React from 'react'
import { Link } from 'react-router-dom'

export const ErrorPage = () => {
    return (
        <div className='container text-center'>
            <h1 className='fw-light mb-3'>Page not Found !</h1>
            <h4>404 Error occurred</h4>
            <h6>Browse other pages <Link to={'/'}>Home</Link></h6>
        </div>
    )
}
