import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export const useBookmark = (dealId, initialIsSaved = false) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);

  const toggleBookmark = async () => {
    if (isLoading) return;
    
    // Optimistic UI update
    setIsSaved(prev => !prev);
    setIsLoading(true);

    try {
      // POST /api/v1/deals/:id/bookmark
      const res = await api.post(`/api/v1/deals/${dealId}/bookmark`);
      
      // The API lib throws an error if !res.ok, so if we reach here, it's successful.
      // But we can check res.message or we just assume success.
      // 201 Created -> saved, 200 OK -> unsaved based on the backend spec.
      // If the backend actually returns {"message": "Deal saved"}, we can use that to confirm.
      
      const message = res?.message || res?.data?.message;
      if (message && message.toLowerCase().includes('unsaved')) {
        setIsSaved(false);
        toast.success("Deal removed from bookmarks");
      } else {
        setIsSaved(true);
        toast.success("Deal saved to bookmarks");
      }
    } catch (error) {
      // Revert optimistic update on failure
      setIsSaved(prev => !prev);
      
      if (error?.message?.includes('401')) {
        toast.error("Please login to save deals.");
      } else {
        toast.error(error.message || "Failed to update bookmark");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isSaved, isLoading, toggleBookmark };
};
