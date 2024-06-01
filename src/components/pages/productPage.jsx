import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ProductCard } from '../utils/productCard';
import { useScreenWidth } from '../hooks/screenWidth';
import { RateSliderBox } from '../utils/rateSliderBox';
import { useEbayItemData, useSearchEbayData } from '../apis/ebayItem';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '../utils/loadingSpinner';
import parse from 'html-react-parser';
import Swal from 'sweetalert2'

export const ProductPage = () => {
  const options = {
    slidesPerView: 5,
    modules: [Navigation]
  }

  const screenWidth = useScreenWidth();

  const [imgBoxPos, setImgBoxPos] = useState('absolute');
  const [imgBoxTop, setImgBoxTop] = useState('unset');
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      if (scrollPos >= 20 && screenWidth > 768) {
        setImgBoxPos('fixed');
        setImgBoxTop('4.5em')
      } else {
        setImgBoxPos('absolute');
        setImgBoxTop('unset');
      }
      // console.log(scrollPos);

      const desContHeight = document.getElementsByClassName('ss-prod-des-sec')[0]?.clientHeight;
      const imgContHeight = document.getElementsByClassName('ss-product-page-cont1-sec-1-content-box')[0]?.clientHeight;
      if (scrollPos >= desContHeight - imgContHeight && screenWidth > 768) {
        setImgBoxPos('absolute');
        setImgBoxTop(desContHeight - imgContHeight)
      }
    }
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll);
  }, [])

  const boxStyle = {
    position: imgBoxPos,
    top: imgBoxTop,
    zIndex: 1
  }

  const options3 = {
    slidesPerView: 1,
    modules: [Pagination],
    pagination: {
      dynamicBullets: true,
      clickable: true,
    }
  }

  const [param] = useSearchParams();
  const itemId = decodeURIComponent(param.get('itemId'))

  const [productData, loading] = useEbayItemData(itemId) || null

  useEffect(() => {
    document.title = productData?.title||"Loading Data..."
  }, [productData])

  // Refresh the component
  const [, setDummystate] = useState(0);
  useEffect(() => {
    setDummystate(e => e + 1)
    window.scrollTo(0, 0)
  }, [itemId])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productData?.title,
          url: window.location.href,
        })
      } catch (error) {

      }
    }
  }

  var cartList = [];
  if (!localStorage.getItem('cartList')) {
    cartList = []
  }
  else { cartList = JSON.parse(localStorage.getItem('cartList')) }

  const crtClickHandler = () => {
    if (!cartList.includes(productData?.itemId)) {
      cartList.unshift(productData?.itemId)
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

  const [showImg, setShowImg] = useState(productData?.image?.imageUrl?.replace('.sandbox.ebay', ''))
  useEffect(() => {
    setShowImg(productData?.image?.imageUrl?.replace('.sandbox.ebay', ''))
  }, [productData])



  return (
    <div className='container ss-product-page-container'>
      {(productData || !loading) &&
        <div className='ss-product-page-content'>
          <div className='ss-product-page-cont-1'>
            <section className='ss-prod-img-sec'>
              <div className='ss-product-page-cont1-sec-1'>
                <div className='ss-product-page-cont1-sec-1-content-box' style={boxStyle}>
                  <div className='ss-p-page-img-sec'>
                    <div className='ss-p-page-main-img-box'>
                      <div className='ss-product-page-share-btn'>
                        <button className='ss-share-btn' onClick={handleShare}><i className="ri-share-line"></i></button>
                      </div>
                      <img src={showImg} alt=" " className='ss-product-main-img' draggable={false} />

                      {<div className='ss-res-prod-img-box'>
                        <Swiper className='ss-res-img-slider' {...options3}>
                          <SwiperSlide className='ss-res-img-slides' >
                            <div><img src={productData.image?.imageUrl?.replace('.sandbox.ebay', '')} alt=" " draggable={false} /></div>
                          </SwiperSlide>
                          {productData.additionalImages?.map((img, index) => {
                            return (
                              <SwiperSlide className='ss-res-img-slides' key={index}>
                                <div><img src={img?.imageUrl?.replace('.sandbox.ebay', '')} alt=" " /></div>
                              </SwiperSlide>
                            )
                          })}
                        </Swiper>
                      </div>}
                    </div>


                    <div className='ss-min-img-sel-box'>
                      <Swiper className='ss-p-page-sub-img-box-slider' {...options} navigation >
                        <SwiperSlide onClick={() => setShowImg(productData?.image?.imageUrl?.replace('.sandbox.ebay', ''))}>
                          <div>
                            <div className={`ss-p-page-sub-img-box ${showImg === productData.image.imageUrl?.replace('.sandbox.ebay', '') && 'ss-p-page-sub-img-box-clicked'}`}><img src={productData.image.imageUrl?.replace('.sandbox.ebay', '')} alt=" " /></div>
                          </div>
                        </SwiperSlide>
                        {productData.additionalImages?.map((img, index) => {
                          const imgUrl = img?.imageUrl?.replace('.sandbox.ebay', '')
                          return (
                            <SwiperSlide key={index} onClick={() => setShowImg(imgUrl)}>
                              <div>
                                <div className={`ss-p-page-sub-img-box ${showImg === imgUrl && 'ss-p-page-sub-img-box-clicked'}`}><img src={imgUrl} alt=" " /></div>
                              </div>
                            </SwiperSlide>
                          )
                        })}
                      </Swiper>
                    </div>
                  </div>
                  <div className='ss-p-page-p-btn-box'>
                    <button className='ss-product-p-btn ss-btn-col-d-yellow ss-col-aft-res' onClick={crtClickHandler}><i className="ri-shopping-cart-fill"></i> Add to cart</button>
                    <a href={productData.itemWebUrl} target={'_blank'}>
                      <button className='ss-product-p-btn ss-btn-col-l-yellow'><i className="ri-flashlight-fill"></i> Buy now</button>
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <section className='ss-prod-des-sec'>
              <div>
                <div><span>Brand: </span><span className='text-primary'>{productData?.brand}</span></div>
                <div><h5>{productData?.title}</h5></div>
                <div>
                  <span className='ss-rate-show-box'>{productData?.primaryProductReviewRating?.averageRating}<i className="ri-star-s-fill"></i></span>
                  {productData?.primaryProductReviewRating && <span> {productData?.primaryProductReviewRating?.reviewCount} ratings</span>}
                  <span className='text-success'>In stock</span>
                </div>
                <div className='mt-2'>
                  <div >
                    <span className='fs-3 fw-bold'>${productData?.price.value}</span>
                    {productData.marketingPrice?.originalPrice && <span className='ss-disc-para mx-2'>${productData.marketingPrice?.originalPrice?.value}</span>}
                    {productData.marketingPrice?.discountPercentage && <span className='text-success fw-bold'>{Math.round(productData.marketingPrice?.discountPercentage)}% off</span>}
                  </div>
                  <div className='mt-4 ss-prod-sm-des-box'>
                    {productData.color && <div className='mb-3'>
                      <h6 className='ss-text-fade mb-2'>Color :</h6>
                      <div className='ss-oth-varient-box'>
                        <div className='ss-oth-varient-img-box text-center' >{productData.color}</div>
                      </div>
                    </div>}
                    {/* <div className='mb-3'>
                    <h6 className='ss-text-fade mb-2'>Storage :</h6>
                    <div className='ss-oth-varient-box'>
                      <div className='ss-oth-varient-ram-box'>512gb</div>
                    </div>
                  </div> */}
                    {productData.seller && <div className='mb-3'>
                      <h6 className='ss-text-fade mb-2'>Seller :</h6>
                      <div className='ss-oth-varient-box'>
                        <a href={productData.itemWebUrl} target={'_blank'} className='text-decoration-none fw-bold'>{productData.seller.username}</a>
                      </div>
                    </div>}
                    {productData.shortDescription && <div className='mb-3'>
                      <h6 className='ss-text-fade mb-2'>Description :</h6>
                      <div className='ss-oth-varient-box'>
                        {productData.shortDescription}
                      </div>
                    </div>}
                  </div>
                  <div className='ss-product-specs-box mb-4'>
                    <div className='ss-p-spec-head'>
                      <h5>Specifications</h5>
                    </div>
                    <div>
                      <ul className='ss-product-specs-item-list'>
                        {productData.localizedAspects?.map((item, index) => {
                          return (
                            item && <li className='ss-product-specs-item' key={index}>
                              <div className='ss-spec-title'>{item?.name}</div>
                              <div>{item?.value}</div>
                            </li>
                          )
                        })}

                      </ul>
                    </div>
                  </div>


                  {/* <div className='ss-product-specs-box mt-4'>
                    <div className='ss-p-spec-head'>
                    <h5>Protection Plans</h5>
                    </div>
                    <div className='ss-p-f-des-box'>
                      <div className='ss-prt-plan-item-box'>
                        <div className='d-flex gap-4'>
                          <input type="checkbox" className='align-self-start' />
                          <div className='ss-prt-plan-item-des-box'>
                            <h6>Lorem ipsum dolor sit amet.</h6>
                            <div>
                              <span className='ss-text-fade'>Price: </span><span className='text-primary'>$30</span>
                            </div>
                          </div>
                        </div>
                        <div className='ss-prt-plan-item-box-img-box'><img src={require('../../assets/img/abcd.png')} alt="" /></div>
                      </div>
                    </div>
                  </div> */}

                  {productData?.primaryProductReviewRating && <div className='ss-product-specs-box mt-4'>
                    <div className='ss-p-spec-head'>
                      <h5>Ratings & Reviews</h5>
                    </div>
                    <div className='ss-p-f-des-box ss-prod-rate-show-des-box'>
                      <div className='ss-prod-rate-show-box'>
                        <div><span className='fs-2'>{productData?.primaryProductReviewRating?.averageRating} <i class="ri-star-s-fill"></i></span> <br /> <span className='ss-text-fade'>({productData?.primaryProductReviewRating?.reviewCount} ratings)</span></div>
                        {productData?.primaryProductReviewRating?.ratingHistograms && <div>
                          <div>
                            {productData?.primaryProductReviewRating?.ratingHistograms.map((rateData, index) => {
                              return rateData && <RateSliderBox total_rate={Number(productData?.primaryProductReviewRating?.reviewCount)} rate_nos={Number(rateData.count)} rate_star={rateData.key} key={index} />
                            })}
                          </div>
                        </div>}
                      </div>
                    </div>
                    {/* <div className='ss-prod-rev-box'>
                    <ul>
                      <li className='ss-prod-review-item'>
                        <div>
                          <span className='ss-rate-show-box'>5 <i class="ri-star-s-fill"></i></span>
                          <span className='fw-bold mx-2'>Best Product</span>
                        </div>
                        <div className='px-2'>
                          <span>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id, voluptas. Saepe officiis placeat est nam corporis facere commodi cupiditate fuga.
                          </span>
                        </div>
                        <div className='ss-text-fade ss-fs-sm'>
                          <span>Zee</span>
                          <span className='mx-2'><i className="bi bi-dot"></i></span>
                          <span>10/20/2020</span>
                        </div>
                      </li>
                      <li className='ss-prod-review-item'>
                        <div>
                          <span className='ss-rate-show-box'>5 <i class="ri-star-s-fill"></i></span>
                          <span className='fw-bold mx-2'>Best Product</span>
                        </div>
                        <div className='px-2'>
                          <span>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id, voluptas. Saepe officiis placeat est nam corporis facere commodi cupiditate fuga.
                          </span>
                        </div>
                        <div className='ss-text-fade ss-fs-sm'>
                          <span>Zee</span>
                          <span className='mx-2'><i className="bi bi-dot"></i></span>
                          <span>10/20/2020</span>
                        </div>
                      </li>
                    </ul>
                    <div className='p-3'><a href="" className='text-decoration-none'>More Reviews</a></div>
                  </div> */}
                  </div>}
                </div>
              </div>
            </section>
          </div>
          <div className='ss-product-page-cont-1'>
            {productData.description?.length > 0 && <div className='ss-product-specs-box ss-product-f-des-box'>
              <div className='ss-p-spec-head'>
                <h5>Full Description</h5>
              </div>
              <div className='ss-p-f-des-box'>
                {parse(productData?.description)}
              </div>
            </div>
            }
          </div>
          {productData.categoryIdPath && <SimilarProductSec categoryIdPath={productData.categoryIdPath.replaceAll('|', ',')} />}
        </div>
      }

      {(!productData && loading) && <LoadingSpinner width={'50px'} />}
    </div>
  )
}

const SimilarProductSec = ({ categoryIdPath }) => {
  const navigate = useNavigate();

  const [boxNumbers, setBoxNumbers] = useState(5);
  const screenWidth = useScreenWidth();

  useEffect(() => {
    if (screenWidth <= 1050 && screenWidth > 900) setBoxNumbers(4.5)
    else if (screenWidth <= 900 && screenWidth > 720) {
      setBoxNumbers(4);
    }
    else if (screenWidth <= 720 && screenWidth > 520) {
      setBoxNumbers(3.5);
    }
    else if (screenWidth <= 520 && screenWidth > 395) {
      setBoxNumbers(3);
    }
    else if (screenWidth <= 395 && screenWidth > 350) {
      setBoxNumbers(2.5);
    }
    else if (screenWidth <= 350) {
      setBoxNumbers(2.5);
    }
    else {
      setBoxNumbers(5);
    }

  }, [screenWidth])
  const options2 = {
    slidesPerView: boxNumbers,
    modules: [Navigation],
  }

  const similarProdData = useSearchEbayData({ category_ids: categoryIdPath?.replaceAll('|', ',') })?.itemSummaries;
  return (
    <div className='mt-3'>
      <section className='ss-product-sec-t-1'>
        <h5 className='mb-4'>Similar Products</h5>
        <div>
          <Swiper {...options2} className='ss-slider-box' navigation >
            {
              similarProdData?.map((item, index) => {
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
  )
}
