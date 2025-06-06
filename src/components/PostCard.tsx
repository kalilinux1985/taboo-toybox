import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import CommentSection from './CommentSection';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface User {
  id: string;
  username: string;
  avatar_url: string;
  role: string;
  isPremium?: boolean;
}

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

interface Post {
  id: string;
  user: User;
  content: string;
  media_url: string;
  likeCount: number;
  comments: Comment[];
  timeAgo: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsData, setCommentsData] = useState<Comment[]>(post.comments);
  const { isLiked, likeCount, isLoading, handleLike } = usePostInteractions(
    post.id,
    post.likeCount
  );

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = (comment: Comment) => {
    setCommentsData((prev) => [comment, ...prev]);
  };

  return (
    <Card className='bg-slate-900 shadow-sm border border-slate-700 hover:shadow-md transition-all duration-200 overflow-hidden'>
      <CardContent className='p-0'>
        <div className='p-6 pb-4'>
          <div className='flex items-start justify-between'>
            <div className='flex flex-row w-full items-center space-x-3'>
              <div className='flex flex-col flex-nowrap'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={post.user.avatar_url} />
                  <AvatarFallback>
                    {post.user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <h3 className='font-semibold text-slate-200'>
                    {post.user.username}
                  </h3>
                  {post.user.isPremium && (
                    <Badge className='bg-gradient-to-r from-violet-500 to-violet-600 text-white border-0 text-xs'>
                      Premium
                    </Badge>
                  )}
                </div>
                <div className='flex items-center gap-2 text-sm text-slate-400'>
                  <span>{post.user.role}</span>
                  <span>•</span>
                  <span>{post.timeAgo}</span>
                </div>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleSave}>
              <Bookmark
                className={`h-4 w-4 ${
                  isSaved ? 'fill-current text-violet-400' : 'text-slate-400'
                }`}
              />
            </Button>
          </div>
          <p className='text-slate-300 mt-2'>{post.content}</p>
        </div>

        {post.media_url && (
          <div className='relative xs:flex xs:flex-col xs:max-w-full xs:max-h-full sm:flex-row'>
            <img
              src={post.media_url}
              alt='Post content'
              className='h-96 sm:h-80 object-cover pl-6'
            />
          </div>
        )}

        <div className='p-6 pt-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-6'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleLike}
                disabled={isLoading}
                className={`flex items-center gap-2 hover:bg-red-900/20 ${
                  isLiked ? 'text-red-400' : 'text-slate-400'
                }`}>
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className='text-sm font-medium'>{likeCount}</span>
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleCommentClick}
                className='flex items-center gap-2 hover:bg-violet-600/20 text-slate-400'>
                <MessageCircle className='h-4 w-4' />
                <span className='text-sm font-medium'>
                  {commentsData.length}
                </span>
              </Button>
            </div>
          </div>

          {showComments && (
            <CommentSection
              postId={post.id}
              comments={commentsData}
              onAddComment={handleAddComment}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
