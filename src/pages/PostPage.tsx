import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Post from './Post';
import { useAuth } from '@/contexts/AuthContext'; // Assuming you have this

function PostPage() {
  const { postId } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get current user from auth context

  useEffect(() => {
    async function fetchPost() {
      if (!postId) return;
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();
      
      if (data) setPostData(data);
      setLoading(false);
    }
    
    fetchPost();
  }, [postId]);

  if (loading) return <div>Loading...</div>;
  if (!postData) return <div>Post not found</div>;
  if (!user) return <div>Please log in</div>;

  return <Post post={postData} user={user} />;
}

export default PostPage;