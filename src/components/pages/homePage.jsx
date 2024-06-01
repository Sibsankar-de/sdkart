import React, { useEffect, useState } from 'react'
import axios from 'axios'
import catList from '../../json/categoryList.json'
import Slider from 'react-slick'
import { ProductCard } from '../utils/productCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'
import { useScreenWidth } from '../hooks/screenWidth'
import { LoadingSpinner } from '../utils/loadingSpinner'
import { useSearchEbayData } from '../apis/ebayItem'
import { Link, useNavigate } from 'react-router-dom'

export const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'SDkart - start shopping from here!'
      }, [])

    const [boxNumbers, setBoxNumbers] = useState(5);
    const [boxNumbers2, setBoxNumbers2] = useState(7);
    const screenWidth = useScreenWidth();

    useEffect(() => {
        if (screenWidth <= 1050 && screenWidth > 900) setBoxNumbers(4.5)
        else if (screenWidth <= 900 && screenWidth > 720) {
            setBoxNumbers(4); setBoxNumbers2(6)
        }
        else if (screenWidth <= 720 && screenWidth > 520) {
            setBoxNumbers(3.5); setBoxNumbers2(5)
        }
        else if (screenWidth <= 520 && screenWidth > 395) {
            setBoxNumbers(3); setBoxNumbers2(4)
        }
        else if (screenWidth <= 395 && screenWidth > 350) {
            setBoxNumbers(2.5); setBoxNumbers2(3.5)
        }
        else if (screenWidth <= 350) {
            setBoxNumbers(2.5);
            setBoxNumbers2(3);
        }
        else {
            setBoxNumbers(5);
            setBoxNumbers2(7)
        }

    }, [screenWidth])

    const options = {
        slidesPerView: boxNumbers,
        modules: [Navigation],
    }

    const options2 = {
        slidesPerView: boxNumbers2,
        modules: [Pagination],
    }

    const searchData = useSearchEbayData({ category_ids: '9355,15032' })?.itemSummaries;
    const searchData3 = useSearchEbayData({ category_ids: '171146,11450,260010' })?.itemSummaries;
    const searchData2 = useSearchEbayData({ q: 'furniture' })?.itemSummaries;
    const searchData4 = useSearchEbayData({ category_ids: '139971,1249' })?.itemSummaries;


    return (
        <div className='container ss-home-page-container'>
            <div className='ss-home-p-content-box'>

                <section className='ss-hpage-category-sec'>
                    <div>
                        <ul>
                            <Swiper className='ss-cat-list-slider-box' {...options2}>
                                {catList.map((item, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <li>
                                                <Link to={`/search?category_ids=${item.category_ids}`}>
                                                    <div className={!item.img_url ? 'ss-catagory-img-back' : undefined}>
                                                        <img src={require(`../../assets/img/${item.img_url}`)} alt="" draggable={false} />
                                                    </div>
                                                    <div className='fw-bold mt-2 text-nowrap'>
                                                        {item.name}
                                                    </div>
                                                </Link>
                                            </li>
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        </ul>
                    </div>
                </section>

                <section className='ss-product-sec-t-1'>
                    <h5 className='mb-4'>Deals on Phones and Accesories</h5>
                    <div>
                        <Swiper {...options} className='ss-slider-box' navigation >
                            {
                                searchData?.map((item, index) => {
                                    return (
                                        (item?.image) && <SwiperSlide key={index}  onClick={() => navigate(`/product?itemId=${encodeURIComponent(item?.itemId)}`)}>
                                            <ProductCard>
                                                {(item?.image?.imageUrl) ?
                                                    <>
                                                        <div className='ss-item-card-img-box'>
                                                            <img src={item?.image?.imageUrl} alt="" draggable={false} />
                                                        </div>
                                                        <div className='text-center'>
                                                            <div>{item?.title.slice(0, 15)}..</div>
                                                            <div><span className='fw-bold'>Price:</span> ${item?.price.value}</div>
                                                        </div>
                                                    </> :
                                                    <div className='ss-item-loading-box'></div>
                                                }
                                            </ProductCard>
                                        </SwiperSlide>
                                    )
                                })
                                || <LoadingSpinner className={'ss-home-p-item-box-loading'} />
                            }
                        </Swiper>
                    </div>
                </section>
                <section className='ss-product-sec-t-1'>
                    <h5 className='mb-4'>Best Deals on Fashion</h5>
                    <div>
                        <Swiper {...options} className='ss-slider-box' navigation >
                            {!searchData3 ? <LoadingSpinner className={'ss-home-p-item-box-loading'} /> :
                                searchData3.map((item, index) => {
                                    return (
                                        item?.image && <SwiperSlide key={index} onClick={() => navigate(`/product?itemId=${encodeURIComponent(item?.itemId)}`)}>
                                            <ProductCard>
                                                {item?.image?.imageUrl ?
                                                    <>
                                                        <div className='ss-item-card-img-box'>
                                                            <img src={item?.image?.imageUrl} alt="" draggable={false} />
                                                        </div>
                                                        <div className='text-center'>
                                                            <div>{item?.title.slice(0, 15)}..</div>
                                                            <div><span className='fw-bold'>Price:</span> ${item?.price.value}</div>
                                                        </div>
                                                    </> :
                                                    <div className='ss-item-loading-box'></div>
                                                }
                                            </ProductCard>
                                        </SwiperSlide>
                                    )
                                })}
                        </Swiper>
                    </div>
                </section>

                <section className='ss-product-sec-t-2'>
                    <section className='ss-product-sec-t2-p-1'>
                        <div className='ss-product-sec-t2-p1-n-1'>
                            {searchData2 ? <>
                                <div onClick={() => navigate(`/product?itemId=${encodeURIComponent(searchData2[0]?.itemId)}`)}>
                                    {<img src={searchData2[0]?.image?.imageUrl} alt="" draggable={false} />
                                    }
                                </div>
                                <div className='mt-2'><span className='fw-bold'>Price: </span>${searchData2[0]?.price.value}</div>
                            </> :
                                <LoadingSpinner />}
                        </div>
                        <div className='ss-product-sec-t2-p1-n-2'>
                            <div className='ss-product-sec-t2-p1-n2-p-box ss-bb-2'>
                                {searchData2 ? <>
                                    <div onClick={() => navigate(`/product?itemId=${encodeURIComponent(searchData2[0]?.itemId)}`)}>
                                        {<img src={searchData2[1]?.image?.imageUrl} alt="" draggable={false} />
                                        }
                                    </div>
                                    <div className='mt-2'><span className='fw-bold'>Price: </span>${searchData2[1]?.price.value}</div>
                                </> :
                                    <LoadingSpinner />}
                            </div>
                            <div className='ss-product-sec-t2-p1-n2-p-box'>
                                {searchData2 ? <>
                                    <div onClick={() => navigate(`/product?itemId=${encodeURIComponent(searchData2[0]?.itemId)}`)}>
                                        {<img src={searchData2[2]?.image?.imageUrl} alt="" draggable={false} />
                                        }
                                    </div>
                                    <div className='mt-2'><span className='fw-bold'>Price: </span>${searchData2[2]?.price.value}</div>
                                </> :
                                    <LoadingSpinner />}
                            </div>
                        </div>
                    </section>
                    <section className='ss-product-sec-t2-p-2'>
                        <h5 className='mb-3'>Deals on Furnitures</h5>
                        <div className='ss-product-sec-t2-item-box'>
                            {!searchData2 ? <LoadingSpinner className={'ss-home-p-item-box-loading'} /> :
                                searchData2.map((item, index) => {
                                    return (
                                        index < 6 && <ProductCard key={index}  >
                                            <div className='ss-item-card-img-box ss-item-card-sm-img-box' onClick={() => navigate(`/product?itemId=${encodeURIComponent(item?.itemId)}`)}>
                                                <img src={item?.image?.imageUrl} alt="" draggable={false} />
                                            </div>
                                        </ProductCard>
                                    )
                                })}
                        </div>
                    </section>
                </section>

                <section className='ss-product-sec-t-1'>
                    <h5 className='mb-4'>Deals on Hobbies</h5>
                    <div>
                        <Swiper {...options} className='ss-slider-box' navigation >
                            {
                                searchData4?.map((item, index) => {
                                    return (
                                        (item?.image) && <SwiperSlide key={index} onClick={() => navigate(`/product?itemId=${encodeURIComponent(item?.itemId)}`)}>
                                            <ProductCard>
                                                {(item?.image?.imageUrl) ?
                                                    <>
                                                        <div className='ss-item-card-img-box'>
                                                            <img src={item?.image?.imageUrl} alt="" draggable={false} />
                                                        </div>
                                                        <div className='text-center'>
                                                            <div>{item?.title.slice(0, 15)}..</div>
                                                            <div><span className='fw-bold'>Price:</span> ${item?.price.value}</div>
                                                        </div>
                                                    </> :
                                                    <div className='ss-item-loading-box'></div>
                                                }
                                            </ProductCard>
                                        </SwiperSlide>
                                    )
                                })
                                || <LoadingSpinner className={'ss-home-p-item-box-loading'} />
                            }
                        </Swiper>
                    </div>
                </section>
            </div>
        </div>
    )
}
