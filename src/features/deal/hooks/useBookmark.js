import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useBookmark = (dealId, initialIsSaved = false) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Sync state with prop if prop changes
  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const toggleBookmark = async () => {
    if (isLoading) return;
    
    // Optimistic UI update
    setIsSaved(prev => !prev);
    setIsLoading(true);

    try {
      // POST /api/v1/bookmarks/:id
      const res = await api.post(`/api/v1/bookmarks/${dealId}`);
      
      const message = res?.message || res?.data?.message;
      if (message && message.toLowerCase().includes('unsaved')) {
        setIsSaved(false);
        toast.success("Removed from bookmarks");
      } else {
        setIsSaved(true);
        toast.success("Saved to bookmarks");
      }

      // Invalidate the saved deals query so the list updates
      queryClient.invalidateQueries({ queryKey: ["saved-deals"] });
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
