import React, { useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import { useScreenWidth } from '../hooks/screenWidth';
import { NotificationBox } from './notificationBox';

export const Navbar = () => {
    const navigate = useNavigate();
    const [notifBoxOpen, setNotifBoxOpen] = useState(false);
    const screenWidth = useScreenWidth();
    const [resSearchOpen, setResSearchOpen] = useState(false);
    const openState = (e) => {
        setResSearchOpen(e);
    }

    const [input, setInput] = useState('')
    const searchHandler = (e) => {
        e.preventDefault();
        if (input) {
            const param = { q: encodeURIComponent(input.trim()) }
            const genQuery = new URLSearchParams(param)
            navigate(`/search?${genQuery.toString()}`)
            window.location.reload()
        }

    }
    return (
        <div className='ss-navbox'>
            <nav className='ss-navbar'>
                <section className='ss-nav-sec-1'>
                    <div className="ss-nav-logo-box">
                        <Link to={'/'}><span><img src={require('../../assets/img/kart-logo.png')} alt="" /></span></Link>
                    </div>
                    <form className="ss-nav-search-bar-box" onSubmit={searchHandler}>
                        <div className='ss-nav-search-btn' onClick={searchHandler}><i className="ri-search-2-line"></i></div>
                        <div>
                            <input type="text" placeholder='Search for products brands or more' className='form-control' id='ss-search-bar' onChange={(e) => setInput(e.target.value)} />
                        </div>
                    </form>
                </section>
                <section className='ss-nav-opt-sec'>
                    {screenWidth <= 475 && <div>
                        <button className='btn ss-nav-opt-sec-btn' onClick={() => setResSearchOpen(true)}>
                            <span><i className="ri-search-2-line fs-4"></i></span>
                        </button>
                    </div>}
                    <div>
                        <button className='btn ss-nav-opt-sec-btn' onClick={() => navigate('cart')}>
                            <div className='d-flex justify-content-end'>
                                <span className='ss-cart-count-box'>40</span>
                                <span><i className="bi bi-cart3 fs-4"></i></span>
                            </div>
                            <span>Cart</span>
                        </button>
                    </div>
                    <div>
                        <button className='btn ss-nav-opt-sec-btn' data-tooltip-id='ss-notif-ico' data-tooltip-content={'notifications'} onClick={() => setNotifBoxOpen(!notifBoxOpen)}>
                            <span><i className="ri-notification-2-line fs-4"></i></span>
                        </button>
                        <Tooltip id='ss-notif-ico' place='bottom' delayShow={2000} />
                    </div>
                </section>
            </nav>
            <NotificationBox openState={notifBoxOpen} openBox={e => setNotifBoxOpen(e)} />
            {resSearchOpen && <SearchBoxResponsive openState={openState} />}
        </div>
    )
}

const SearchBoxResponsive = (props) => {
    const [input, setInput] = useState('')
    const navigate = useNavigate()
    const searchHandler = (e) => {
        e.preventDefault();
        if (input) {
            const param = { q: input.trim() }
            const genQuery = new URLSearchParams(param)
            navigate(`/search?${genQuery}`)
            window.location.reload()
        }

    }
    return (
        <div className='ss-res-search-box'>
            <div className='d-flex align-items-center gap-2'>
                <div><button className="btn p-1 py-0" onClick={() => props.openState(false)}><i className="ri-arrow-left-line fs-3"></i></button></div>
                <form className="ss-nav-search-bar-box ss-res-nav-search-bar-box" onSubmit={searchHandler}>
                    <div className='ss-nav-search-btn' onClick={searchHandler}><i className="ri-search-2-line"></i></div>
                    <div>
                        <input type="text" placeholder='Search for products brands or more' className='form-control' id='ss-search-bar' onChange={e => setInput(e.target.value)} autoFocus />
                    </div>
                </form>
            </div>
        </div>
    )
}
