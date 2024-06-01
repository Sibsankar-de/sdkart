import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import { useEbayItemData } from '../apis/ebayItem';
import { LoadingSpinner } from '../utils/loadingSpinner';
import Swal from 'sweetalert2';

export const CartPage = () => {
    const navigate = useNavigate()
    const [cartHeadPos, setCartHeadPos] = useState({ position: 'absolute', top: 'unset' });
    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            if (scrollPos >= 36.666) {
                setCartHeadPos({ position: 'fixed', top: '3.75em' })
            } else {
                setCartHeadPos({ position: 'absolute', top: 'unset' })
            }
        }
        document.addEventListener('scroll', handleScroll)
        return () => document.removeEventListener('scroll', handleScroll);
    }, [])


    useEffect(() => {
        document.title = 'Item cart'
    }, [])

    var cartList = [];
    if (!localStorage.getItem('cartList')) {
        cartList = []
    }
    else { cartList = JSON.parse(localStorage.getItem('cartList')) }

    const [cartAddedList, setCartAddedList] = useState(cartList)

    const [priceObj, setPriceObj] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        if (Object.keys(priceObj)?.length > 0) {
            const sum = Object.values(priceObj)?.reduce((acc, price) => acc + price, 0)
            setTotalPrice(sum)
        }
    }, [priceObj])

    const cartDeleteHandler = (itemId) => {
        const newCart = cartList.filter(e => {
            return e !== itemId;
        })
        const newPriceObj = { ...priceObj }
        delete newPriceObj[itemId]
        localStorage.setItem('cartList', JSON.stringify(newCart));
        setCartAddedList(newCart)
        setPriceObj(newPriceObj)
        Swal.fire(
            {
                position: 'top',
                title: 'Cart deleted',
                icon: 'info',
                showConfirmButton: false,
                timer: 1500,
                toast: true
            }
        )
    }



    return (
        <div className='container ss-cart-container'>
            <section className='ss-cart-content-box'>
                <div className='ss-cart-page-heading' style={cartHeadPos}>
                    <div><button className='btn ss-nav-opt-sec-btn' onClick={() => navigate(-1)}><i class="ri-arrow-left-line fs-5"></i></button></div>
                    <div>
                        <h5>{cartAddedList?.length > 0 ? cartAddedList?.length : 'No'} items found in your cart</h5>
                        <h6 className='mb-0'>Cart Total: <span className='text-success'>${totalPrice}</span></h6>
                    </div>
                </div>
                <div>
                    <ul className='ss-cart-item-list'>
                        {cartAddedList.map(itemId => {
                            return <CartItem
                                itemId={itemId}
                                key={itemId}
                                priceCount={price => setPriceObj({ ...priceObj, [itemId]: Number(price) })}
                                cartDeleteHandler={() => cartDeleteHandler(itemId)}
                            />
                        })}
                    </ul>
                </div>
            </section>
        </div>
    )
}

const CartItem = ({ itemId, priceCount, cartDeleteHandler }) => {
    const navigate = useNavigate();
    const [itemCount, setItemCount] = useState(1)

    const [productData,] = useEbayItemData(itemId)

    useEffect(() => {
        priceCount(Number(productData?.price.value) || 0)
    }, [productData])

    useEffect(() => {
        productData && priceCount(Number(productData?.price.value) * itemCount || 0)
    }, [itemCount])

    const itemUrl = `/product?itemId=${itemId}`
    return (
        productData && <li className='ss-cart-item-box'>
            <div>
                <input type="checkbox" className='ss-cart-item-checkbox' checked />
            </div>
            <div className='ss-cart-item-img-box'>
                <img src={productData.image?.imageUrl?.replace('.sandbox.ebay', '')} alt=" " onClick={() => navigate(itemUrl)} />
                <button className='ss-res-cart-del-btn' onClick={() => cartDeleteHandler()}>Delete</button>
            </div>
            <div className='ss-cart-item-des-box'>
                <div className='ss-cart-item-header-box'>
                    <span><h5><Link to={itemUrl}>{productData.title}</Link></h5></span>
                    <span className='ss-justify-s-end ss-cart-del-btn-line'><button className='btn p-1 py-0' data-tooltip-id='cart-remove-btn' data-tooltip-content={'Remove Item'} onClick={() => cartDeleteHandler()}><i className='ri-delete-bin-5-line fs-5'></i></button></span>
                    <Tooltip id='cart-remove-btn' place='bottom' delayShow={2000} />
                </div>
                {/* <div className='mt-1'></div> */}
                <div className='ss-cart-item-price-box'>
                    <div className='ss-cart-item-price-para'>${productData.price.value}</div>
                    <div className='ss-item-add-box'>
                        {itemCount > 1 ? <span className='ss-add-b-ico text-center' onClick={() => { itemCount > 1 && setItemCount(itemCount - 1) }}><i className={'ri-subtract-line'}></i></span>
                            : <span className='ss-add-b-ico text-center' onClick={() => { cartDeleteHandler() }}><i className={'ri-delete-bin-4-line'}></i></span>}
                        <span className='text-center text-success'>{itemCount}</span>
                        <span className='ss-add-b-ico text-center' onClick={() => { itemCount < 9 && setItemCount(itemCount + 1) }}><i className='ri-add-line'></i></span>
                    </div>
                </div>
            </div>
        </li>
    )
}
