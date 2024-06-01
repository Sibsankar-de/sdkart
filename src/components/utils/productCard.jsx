import React from 'react'

export const ProductCard = ({ children }) => {
    return (
        <div className='m-1 '>
            <div className='ss-item-card'>
                {children}
            </div>
        </div>
    )
}
