import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (customUrl = url, customOptions = options) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(customUrl, customOptions);
      setData(res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error?.message || 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, mutate: setData };
};