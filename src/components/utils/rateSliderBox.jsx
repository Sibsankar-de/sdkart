import React from 'react'

export const RateSliderBox = ({ total_rate, rate_nos, rate_star }) => {
    const noGenerator = () => {
        const totalrate = Number(total_rate)
        const ratenos = Number(rate_nos)

        if (ratenos > totalrate) return null;
        const result = (ratenos / totalrate) * 10

        return result
    }

    const style = {
        width: `${noGenerator()}em`
    }
    return (
        <div className='ss-rate-show-slider-box'>
            <div>{rate_star}<i class="ri-star-s-fill"></i></div>
            <div>
                <div className='ss-rate-show-slider' style={style}></div>
                <div className='ss-rate-show-slider-track'></div>
            </div>
            <div className='ss-text-fade'>{rate_nos}</div>
        </div>
    )
}
