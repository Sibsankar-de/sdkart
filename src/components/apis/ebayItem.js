import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const apiURI = process.env.REACT_APP_API_URI

const useSearchEbayData = (params) => {
    const [data, setData] = useState(null);
    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(`${apiURI}/search`,
                {
                    params: params,
                }
            )
            setData(res.data);
        } catch (error) {
            // console.error(error);
            setTimeout(() => {
                Swal.fire(
                    {
                        position: 'top',
                        title: 'Failed to connect with Server',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 5000,
                        toast: true,

                    }
                )
            }, 1000)
        }
    }

    return data;
}

const useEbayItemData = (itemid) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData() }, [itemid])

    const fetchData = async () => {
        try {
            const res = await axios.get(`${apiURI}/item/${itemid}`)
            setData(res.data);
        } catch (error) {
            // console.error(error);
            setTimeout(() => {
                Swal.fire(
                    {
                        position: 'top',
                        title: 'Failed to connect with Server',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 5000,
                        toast: true,

                    }
                )
            }, 1000)
        } finally {
            setLoading(false);
        }
    }

    return [data, loading];
}

export { useSearchEbayData, useEbayItemData }