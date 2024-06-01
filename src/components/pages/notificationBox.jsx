import React, { useEffect, useRef } from 'react'

export const NotificationBox = (props) => {
    const notifBoxRef = useRef(null);
    useEffect(() => {
        document.addEventListener('mousedown', (e) => {
            if (notifBoxRef.current && props.openState && !notifBoxRef.current.contains(e.target)) {
                props.openBox(false)
            }
        })

        document.getElementsByTagName('body')[0].style.overflowY = props.openState ? 'hidden' : 'scroll'
    })
    return (
        <div className={`ss-notif-box-container ${!props.openState ? 'ss-notif-box-container-closed':''}`} ref={notifBoxRef}>
            <div className='ss-notif-box-content-box'>
                <h5><button className="btn p-1 py-0" onClick={() => props.openBox(false)}><i className="ri-arrow-left-line fs-4"></i></button> Notifications</h5>
                <div className='text-center mt-5'>
                    No new Notifications Yet
                </div>
            </div>
        </div>
    )
}
