import React from 'react'

export const LoadingSpinner = ({ className, width }) => {
  return (
    <div className={`ss-loading-spinner ${className}`}>
      <img src={require('../../assets/img/loading.gif')} alt="" style={{ width: width ? width : '30px' }} draggable={false}/>
    </div>
  )
}
