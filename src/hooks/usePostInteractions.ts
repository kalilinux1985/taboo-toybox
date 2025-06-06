
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePostInteractions = (postId: string, initialLikes: number) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const newLikedState = !isLiked;
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
    
    // Optimistic update
    setIsLiked(newLikedState);
    setLikeCount(newLikeCount);

    try {
      // In a real implementation, you'd update the database here
      // For now, we'll simulate the action
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: newLikedState ? "Post liked!" : "Post unliked",
        duration: 2000,
      });
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!newLikedState);
      setLikeCount(likeCount);
      
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this B2B listing',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Post link copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    }
  };

  return {
    isLiked,
    likeCount,
    isLoading,
    handleLike,
    handleShare,
  };
};
