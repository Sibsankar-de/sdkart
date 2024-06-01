import React, { useEffect, useState } from 'react'
import { json, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import { useEbayItemData, useSearchEbayData } from '../apis/ebayItem';
import { useScreenWidth } from '../hooks/screenWidth';
import { LoadingSpinner } from '../utils/loadingSpinner';
import Swal from 'sweetalert2'

export const SearchResultPage = () => {
    const navigate = useNavigate();
    const [filterBoxFlow, setFilterBoxFlow] = useState(false);
    const [fBoxTop, setFboxTop] = useState(undefined);
    useEffect(() => {
        const handleScroll = () => {
            const contHeight = document.getElementById('search-container').offsetHeight;
            const filterBoxHeight = document.getElementsByClassName('ss-search-page-filter-content-box')[0].offsetHeight;
            const scrollY = window.scrollY;
            if ((contHeight - filterBoxHeight) <= scrollY) { setFilterBoxFlow(true); setFboxTop(contHeight - filterBoxHeight + 95) }
            else { setFilterBoxFlow(false); setFboxTop(undefined) }
        }
        document.addEventListener('scroll', handleScroll);
        return () => document.removeEventListener('scroll', handleScroll)
    }, [])

    const screenWidth = useScreenWidth();

    const [fBoxOpen, setFBoxOpen] = useState(false);
    const [searchParam] = useSearchParams();
    const query = decodeURIComponent(searchParam.get('q')) || null;
    const catId = decodeURIComponent(searchParam.get('category_ids'));

    const searchResultList = useSearchEbayData(query ? { q: query } : { category_ids: catId })?.itemSummaries;

    useEffect(() => {
        document.title = query?`Search - ${query}`:'Sdkart - Search data'
    }, [])


    console.log(searchResultList);
    const [filterdata, setFilterData] = useState({})

    const getFilterData = (data) => {
        setFilterData(data)
    }
    const applyFilterHandler = () => {
        if (Object.keys(filterdata).length > 0) {
            const genQuery = new URLSearchParams({ q: query, ...filterdata })
            const fUrl = `/search?${genQuery.toString()}`
            navigate(fUrl)
            window.location.reload()
            window.scrollTo(0, 0)
        }
    }
    return (
        <div className='container ss-search-page-container' id='search-container'>
            <section className='ss-search-page-filter-box'>
                <div className={`ss-search-page-filter-content-box `} style={{ position: filterBoxFlow ? 'absolute' : 'fixed', top: filterBoxFlow ? fBoxTop : 'unset' }}>
                    {screenWidth > 768 && < FilterBox filterChange={getFilterData} />}
                    <div className='mt-5'><button className="btn btn-success py-1 rounded-3" onClick={applyFilterHandler}> Apply filters</button></div>
                </div>
            </section >
            <section className='ss-search-page-search-content-box'>
                {!searchResultList && <div className='ss-search-page-search-content-box ss-search-page-loader-box'>
                    <LoadingSpinner width={'40px'} />
                </div>}
                <div className='p-2'>
                    <div className='mb-3'>
                        <div className='mb-4 ss-s-page-result-count-line'>
                            <h5>{searchResultList && searchResultList.length > 0 ? searchResultList.length : 'No'} results found on your search "{query}"</h5>
                        </div>
                        <div className='ss-filter-btn-box'>
                            <button className='ss-filter-btn ss-justify-s-end' onClick={() => setFBoxOpen(!fBoxOpen)}><i className="ri-filter-3-line"></i></button>
                        </div>
                    </div>
                    <div>
                        <ul className='ss-search-item-list'>
                            {searchResultList &&
                                searchResultList.map((item, index) => {
                                    return <ItemCard key={index} item={item} />
                                })
                            }
                        </ul>
                    </div>
                </div>

            </section>
            <FilterBoxRes openState={fBoxOpen} changeOpenState={e => setFBoxOpen(e)} query={query} />
        </div >
    )
}

const ItemCard = ({ item }) => {
    const screenWidth = useScreenWidth();
    var cartList = [];
    if (!localStorage.getItem('cartList')) {
        cartList = []
    }
    else { cartList = JSON.parse(localStorage.getItem('cartList')) }

    const crtClickHandler = () => {
        if (!cartList.includes(item?.itemId)) {
            cartList.unshift(item?.itemId)
            localStorage.setItem('cartList', JSON.stringify(cartList))

            Swal.fire(
                {
                    position: 'top',
                    title: 'Item added to Cart !',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2500,
                    toast: true
                }
            )
        }
        else {
            Swal.fire(
                {
                    position: 'top',
                    title: 'Item exist in Cart !',
                    icon: 'warning',
                    showConfirmButton: false,
                    timer: 2500,
                    toast: true
                }
            )
        }
    }

    const productURL = `/product?itemId=${encodeURIComponent(item?.itemId)}`

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: item?.title,
                    url: `${window.location.origin}${productURL}`,
                })
            } catch (error) {

            }
        }
    }

    const [data,] = useEbayItemData(item?.itemId)

    const ratingsData = data?.primaryProductReviewRating

    return (
        <li className='ss-search-item-card'>
            <div className='ss-search-item-card-content-box'>
                <div className='ss-s-item-img-box'>
                    <Link to={productURL} target='_blank'>
                        <img src={item?.image?.imageUrl?.replace('.sandbox.ebay', '')} alt=" " draggable={false} />
                    </Link>
                    {screenWidth <= 450 && <div className="ss-product-page-share-btn"><button className="ss-share-btn p-2" onClick={handleShare}><i className="ri-share-line"></i></button></div>}
                </div>
                <div className='ss-s-item-des-box'>
                    <div className='mb-1'>
                        <Link to={productURL} target='_blank'><h5 className='text-break'>{item?.title}</h5></Link>
                    </div>
                    <div className='mb-3'>
                        <span className='d-flex'>
                            <span className='mx-1 ss-rate-show-box'>{ratingsData?.averageRating
                            }<i className="ri-star-s-fill"></i></span>
                            <StarBox rating={ratingsData?.averageRating} />
                        </span>
                        {ratingsData?.reviewCount && <div>rate by {ratingsData?.reviewCount} people</div>}
                    </div>
                    <div className='fs-4 mb-2'>${item?.price.value}</div>
                    <div className='d-flex gap-3'>
                        <button className='ss-add-t-cart-btn' onClick={crtClickHandler}><span><i className="ri-shopping-cart-fill"></i> Add to cart</span></button>
                        {screenWidth > 450 && <button className='ss-share-btn' data-tooltip-id='share-tooltip' data-tooltip-content={'Share'} onClick={handleShare}><i className="ri-share-2-line"></i></button>}
                        <Tooltip id='share-tooltip' place='bottom' delayShow={1500} />
                    </div>
                </div>
            </div>

        </li>
    )
}

const StarBox = ({ rating }) => {
    return (
        <div className='ss-star-box'>
            {Array.from({ length: Math.floor(Number(rating)) }).map((_, index) => {
                return <span key={index}><i className="ri-star-s-fill"></i></span>
            })}
            {Number(rating) - Math.floor(Number(rating)) > 0 &&
                <span><i className="ri-star-half-s-fill"></i></span>}
            {Array.from({ length: 5 - Math.ceil(Number(rating)) }).map((_, index) => {
                return <span><i className="ri-star-s-line"></i></span>
            })}

        </div>
    )
}

const FilterBox = ({ filterChange }) => {
    const [filterProp, setFilterProp] = useState({});

    const [rangeInput, setRangeInput] = useState({ max: 1000, min: 0 })

    useEffect(() => {
        setFilterProp({ ...filterProp, filter: `price[${rangeInput.min}..${rangeInput.max}]` })
    }, [rangeInput])

    useEffect(() => {
        filterChange(filterProp)
    }, [filterProp])
    return (
        <>
            <div className='mb-4'>
                <h5>Sort by</h5>
                <div>
                    <div className='mb-1'>
                        <input type="radio" id='res-sort-1' name='sort-radio-res' className='mx-2' key={'bprice'} onChange={() => setFilterProp({ ...filterProp, sort: 'price' })} />
                        <label htmlFor="res-sort-1">By price</label>
                    </div>
                    <div className='mb-1'>
                        <input type="radio" id='res-sort-2' name='sort-radio-res' className='mx-2' key={'nadded'} onChange={() => setFilterProp({ ...filterProp, sort: 'newlyListed' })} />
                        <label htmlFor="res-sort-2">Newly Added</label>
                    </div>
                    <div className='mb-1'>
                        <input type="radio" id='res-sort-3' name='sort-radio-res' className='mx-2' key={'pltoh'} onChange={() => setFilterProp({ ...filterProp, sort: 'price' })} />
                        <label htmlFor="res-sort-3">Price low to high</label>
                    </div>
                    <div className='mb-1'>
                        <input type="radio" id='res-sort-4' name='sort-radio-res' className='mx-2' key={'phtol'} onChange={() => setFilterProp({ ...filterProp, sort: '-price' })} />
                        <label htmlFor="res-sort-4">Price high to low</label>
                    </div>
                </div>
            </div>
            <div>
                <h5>Filters</h5>
                <div className='mb-2'>
                    <div>
                        <p className='mb-1'>Max range {rangeInput.max}</p>
                        <input type="range" className='ss-search-range-input' step={10} max={1000} min={5} value={rangeInput.max} onChange={e => setRangeInput({ ...rangeInput, max: e.target.value })} />
                    </div>
                    <div>
                        <p className='mb-1'>Min range {rangeInput.min}</p>
                        <input type="range" className='ss-search-range-input' step={10} max={1000} min={5} value={rangeInput.min} onChange={e => setRangeInput({ ...rangeInput, min: e.target.value })} />
                    </div>
                </div>
                <div>
                    <p className='mb-1'>By price</p>
                    <div className='mb-1'>
                        <input type="checkbox" id='f-res-check-1' className='mx-2' onChange={() => setFilterProp({ ...filterProp, filter: `price[2..50]` })} />
                        <label htmlFor='f-res-check-1'>Under 50</label>
                    </div>
                    <div className='mb-1'>
                        <input type="checkbox" id='f-res-check-2' className='mx-2' onChange={() => setFilterProp({ ...filterProp, filter: `price[50..100]` })} />
                        <label htmlFor='f-res-check-2'>50-100</label>
                    </div>
                    <div className='mb-1'>
                        <input type="checkbox" id='f-res-check-3' className='mx-2' onChange={() => setFilterProp({ ...filterProp, filter: `price[100..300]` })} />
                        <label htmlFor='f-res-check-3'>100-300</label>
                    </div>
                    <div className='mb-1'>
                        <input type="checkbox" id='f-res-check-4' className='mx-2' onChange={() => setFilterProp({ ...filterProp, filter: `price[300..1000]` })} />
                        <label htmlFor='f-res-check-4'>above 300</label>
                    </div>
                </div>
            </div>
        </>
    )
}

const FilterBoxRes = (props) => {
    useEffect(() => {
        document.getElementsByTagName('body')[0].style.overflowY = !props.openState ? 'scroll' : 'hidden'
    })

    const navigate = useNavigate()

    const [filterdata, setFilterData] = useState({})

    const getFilterData = (data) => {
        setFilterData(data)
    }
    const applyFilterHandler = () => {
        if (Object.keys(filterdata).length > 0) {
            const genQuery = new URLSearchParams({ q: props.query, ...filterdata })
            const fUrl = `/search?${genQuery.toString()}`
            navigate(fUrl)
            window.location.reload()
            window.scrollTo(0, 0)
        }
    }
    return (
        <div className={`ss-filter-res-box-cont ${!props.openState && 'ss-filter-res-box-closed'}`}>
            <div className='ss-filter-res-box-cont-box'>
                <button className='btn ss-f-box-close-btn ss-justify-s-end' onClick={() => props.changeOpenState(false)}><i className="ri-close-fill"></i> Close</button>
                <div className='ss-filter-res-box-content-sec'>
                    <FilterBox filterChange={getFilterData} />
                </div>
                <div className='mt-5 ss-app-filter-btn ss-justify-s-end'><button className="btn btn-success py-1 rounded-3" onClick={applyFilterHandler}> Apply filters</button></div>
            </div >
        </div>
    )
}
