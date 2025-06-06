import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar_url: string;
  };
  timeAgo: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user)
        throw new Error('User not authenticated');

      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('username, avatar_url')
        .eq('id', userData.user.id)
        .single();

      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          content: newComment.trim(),
          author_id: userData.user.id,
          author_name: userProfile.username,
          author_avatar: userProfile.avatar_url || '',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newCommentData: Comment = {
        id: data.id,
        content: data.content,
        author: {
          id: data.author_id,
          username: data.author_name,
          avatar_url: data.author_avatar || '',
        },
        timeAgo: 'now',
      };

      onAddComment(newCommentData);
      setNewComment('');
      toast({
        title: 'Comment added!',
        description: 'Your comment has been posted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='mt-6 space-y-4'>
      <div className='flex space-x-3'>
        <Avatar className='h-8 w-8'>
          <AvatarImage src='https://images.unsplash.com/photo-1472099645785-5658abf4c1e8?auto=format&fit=facearea&facepad=2&w=256&q=80' />
          <AvatarFallback>YOU</AvatarFallback>
        </Avatar>
        <div className='flex-1 space-y-2'>
          <Textarea
            placeholder='Write a comment...'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className='min-h-[80px] border text-sm bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-blue-500 resize-none'
          />
          <div className='flex justify-end'>
            <Button
              disabled={isSubmitting || !newComment.trim()}
              onClick={handleSubmitComment}
              className='bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-4 py-1.5'>
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </div>
      {comments.length > 0 && (
        <div className='space-y-4'>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className='flex space-x-3'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={comment.author.avatar_url} />
                <AvatarFallback>
                  {comment.author.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <div className='bg-gray-100 p-3 rounded-xl'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='font-medium text-gray-700'>
                      {comment.author.username}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p className='text-sm text-gray-600'>{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
