// src/pages/Post.tsx
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Reply, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CommentType {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  parent_comment_id?: string;
  user: {
    username: string;
    avatar_url: string;
    role: 'seller' | 'buyer';
  };
}

interface PostProps {
  post: {
    id: string;
    content: string;
    image_url?: string;
    created_at: string;
    user_id: string;
    likes: number;
    comments_count: number;
  };
  user: {
    id: string;
    username: string;
    avatar_url: string;
    role: 'seller' | 'buyer';
  };
}

export function Post({ post, user }: PostProps) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:user_id(username, avatar_url, role)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    if (data) setComments(data);
  };

  useEffect(() => {
    if (showComments) fetchComments();
  }, [showComments]);

  const handleLike = async () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    const { error } = await supabase
      .from('posts')
      .update({ likes: newLikes })
      .eq('id', post.id);
    if (error) setLikes(likes);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: post.id,
        user_id: user.id,
        content: newComment,
        parent_comment_id: replyingTo || null,
      })
      .select('*, user:user_id(username, avatar_url, role)');

    if (data) {
      setComments(prev => [...prev, data[0]]);
      setNewComment('');
      setReplyingTo(null);
    }
  };

  const handleCommentLike = async (commentId: string, currentLikes: number) => {
    const newLikes = currentLikes + 1;
    setComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, likes: newLikes } : c))
    );
    
    const { error } = await supabase
      .from('comments')
      .update({ likes: newLikes })
      .eq('id', commentId);
    
    if (error) setComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, likes: currentLikes } : c))
    );
  };

  return (
    <Card className="p-6 mb-4">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{user.username}</h3>
            <span className="text-sm px-2 py-1 bg-muted rounded-full">
              {user.role}
            </span>
            <span className="text-muted-foreground text-sm">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="mt-2">{post.content}</p>
          
          {post.image_url && (
            <img 
              src={post.image_url} 
              alt="Post content" 
              className="mt-4 rounded-lg max-h-96 object-cover"
            />
          )}

          <div className="flex items-center gap-4 mt-4">
            <Button variant="ghost" onClick={handleLike}>
              <Heart className="w-4 h-4 mr-2" />
              {likes}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {post.comments_count}
            </Button>

            <Button variant="ghost">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {showComments && (
            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    replyingTo ? "Reply to comment..." : "Add a comment..."
                  }
                />
                <Button onClick={handleComment}>
                  {replyingTo ? 'Reply' : 'Comment'}
                </Button>
              </div>

              {comments.map(comment => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onReply={() => setReplyingTo(comment.id)}
                  onLike={() => handleCommentLike(comment.id, comment.likes)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function Comment({
  comment,
  onReply,
  onLike,
}: {
  comment: CommentType;
  onReply: () => void;
  onLike: () => void;
}) {
  return (
    <div className={comment.parent_comment_id ? 'ml-8 border-l-2 pl-4' : ''}>
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.avatar_url} />
          <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">{comment.user.username}</h4>
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
              {comment.user.role}
            </span>
            <span className="text-muted-foreground text-xs">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-sm mt-1">{comment.content}</p>
          
          <div className="flex items-center gap-3 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-muted-foreground"
              onClick={onLike}
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              {comment.likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-muted-foreground"
              onClick={onReply}
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;