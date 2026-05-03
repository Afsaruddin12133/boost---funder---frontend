import { useState, useEffect } from 'react';
import api from '@/lib/api';

export const useBookmarkedDeals = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      // GET /api/v1/bookmarks
      const res = await api.get('/api/v1/bookmarks');
      setBookmarks(res.data || res || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookmarks');
      console.error('Error fetching bookmarks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return { 
    bookmarks, 
    isLoading, 
    error, 
    refetch: fetchBookmarks 
  };
};
