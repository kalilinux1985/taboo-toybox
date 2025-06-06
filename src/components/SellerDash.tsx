import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PostCard from './PostCard';

interface User {
  id: string;
  username: string;
  avatar_url: string;
  role: string;
}

interface Post {
  id: string;
  user: User;
  content: string;
  media_url: string;
  likeCount: number;
  comments: Comment[];
  createdAt: string;
  timeAgo: string;
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

const ActivityFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: postsData, error: postsError } = await supabase.from(
        'posts'
      ).select(`
          id,
          content,
          media_url,
          created_at,
          users (id, username, avatar_url, role)
        `);

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        return;
      }

      const formattedPosts: Post[] = await Promise.all(
        postsData.map(async (post: any) => {
          const { data: commentsData, error: commentsError } = await supabase
            .from('comments')
            .select(
              'id, content, author_id, author_name, author_avatar, created_at'
            )
            .eq('post_id', post.id);

          if (commentsError) {
            console.error('Error fetching comments:', commentsError);
          }

          const { count: likeCount, error: likeError } = await supabase
            .from('likes')
            .select('id', { count: 'exact' })
            .eq('post_id', post.id);

          if (likeError) {
            console.error('Error fetching likes:', likeError);
          }

          const timeAgo = (date: string) => {
            const now = new Date();
            const diff = now.getTime() - new Date(date).getTime();
            const minutes = Math.floor(diff / 60000);
            return minutes < 60
              ? `${minutes}m ago`
              : `${Math.floor(minutes / 60)}h ago`;
          };

          return {
            id: post.id,
            user: {
              id: post.users.id,
              username: post.users.username,
              avatar_url: post.users.avatar_url || '',
              role: post.users.role,
            },
            content: post.content,
            media_url: post.media_url || '',
            likeCount: likeCount || 0,
            comments:
              commentsData?.map((comment: any) => ({
                id: comment.id,
                content: comment.content,
                author: {
                  id: comment.author_id,
                  username: comment.author_name,
                  avatar_url: comment.author_avatar || '',
                },
                timeAgo: timeAgo(comment.created_at),
              })) || [],
            createdAt: post.created_at,
            timeAgo: timeAgo(post.created_at),
          };
        })
      );

      setPosts(formattedPosts);
    };

    fetchPosts();

    // Real-time subscription for posts
    const postSubscription = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        async (payload) => {
          const newPost = payload.new;
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, username, avatar_url, role')
            .eq('id', newPost.user_id)
            .single();

          if (userError) {
            console.error('Error fetching user for new post:', userError);
            return;
          }

          const timeAgo = (date: string) => {
            const now = new Date();
            const diff = now.getTime() - new Date(date).getTime();
            const minutes = Math.floor(diff / 60000);
            return minutes < 60
              ? `${minutes}m ago`
              : `${Math.floor(minutes / 60)}h ago`;
          };

          setPosts((prevPosts) => [
            {
              id: newPost.id,
              user: {
                id: userData.id,
                username: userData.username,
                avatar_url: userData.avatar_url || '',
                role: userData.role,
              },
              content: newPost.content,
              media_url: newPost.media_url || '',
              likeCount: 0,
              comments: [],
              createdAt: newPost.created_at,
              timeAgo: timeAgo(newPost.created_at),
            },
            ...prevPosts,
          ]);
        }
      )
      .subscribe();

    // Real-time subscription for comments
    const commentSubscription = supabase
      .channel('comments-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          const newComment = payload.new;
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === newComment.post_id
                ? {
                    ...post,
                    comments: [
                      {
                        id: newComment.id,
                        content: newComment.content,
                        author: {
                          id: newComment.author_id,
                          username: newComment.author_name,
                          avatar_url: newComment.author_avatar || '',
                        },
                        timeAgo: 'now',
                      },
                      ...post.comments,
                    ],
                  }
                : post
            )
          );
        }
      )
      .subscribe();

    // Real-time subscription for likes
    const likeSubscription = supabase
      .channel('likes-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'likes' },
        async (payload: { new?: Record<string, any>; old?: Record<string, any> }) => {
          const postId = payload.new?.post_id || payload.old?.post_id;
          if (!postId) return;

          const { count, error } = await supabase
            .from('likes')
            .select('id', { count: 'exact' })
            .eq('post_id', postId);

          if (error) {
            console.error('Error updating like count:', error);
            return;
          }

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId ? { ...post, likeCount: count || 0 } : post
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postSubscription);
      supabase.removeChannel(commentSubscription);
      supabase.removeChannel(likeSubscription);
    };
  }, []);

  return (
    <div className='space-y-6'>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
};

export default ActivityFeed;
