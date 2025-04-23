import axiosInstance from "@/services/axiosInstance";
import { useState, useEffect } from "react";

const useFetch = (url, options = {}, initState=[]) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(initState);
    const [loading, setLoading] = useState(true);

     const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance({
                    url,
                    method: options.method || 'GET',
                    ...options,
                });

                const result = response.data;
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
       

        fetchData();
    }, [url, options]);

    return { data, error, loading };
};

export default useFetch;
