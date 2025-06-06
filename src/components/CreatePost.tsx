import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, DollarSign, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CreatePost = () => {
  const [postContent, setPostContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!postContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Check for active session
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error('No active session. Please log in.');
      }

      const user = sessionData.session.user;
      const accessToken = sessionData.session.access_token;
      console.log('JWT:', accessToken);

      let mediaUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, imageFile, {
            upsert: true,
            contentType: imageFile.type,
            headers: { Authorization: `Bearer ${accessToken}` },
          });

        if (uploadError) {
          console.error('Upload Error:', uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);
        if (!urlData.publicUrl) {
          throw new Error('Failed to retrieve public URL for image');
        }
        mediaUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('posts').insert({
        content: postContent.trim(),
        media_url: mediaUrl || null,
        user_id: user.id,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error('Insert Error:', insertError);
        throw new Error(`Failed to create post: ${insertError.message}`);
      }

      setPostContent('');
      setImageFile(null);
      toast({
        title: 'Post created!',
        description: 'Your post has been added to the feed.',
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: `Failed to create post: ${
          error.message || 'Unknown error'
        }`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Early authentication and bucket check
  useEffect(() => {
    const checkAuthAndBucket = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: 'Error',
          description: 'Please log in to post.',
          variant: 'destructive',
        });
        return;
      }

      // Test bucket accessibility
      const { error: bucketError } = await supabase.storage
        .from('post-images')
        .list();
      if (bucketError) {
        console.error('Bucket Access Error:', bucketError);
        toast({
          title: 'Error',
          description: 'Cannot access storage bucket. Check permissions.',
          variant: 'destructive',
        });
      }
    };
    checkAuthAndBucket();
  }, [toast]);

  return (
    <Card className='create-postmb-6 bg-slate-900/50 backdrop-blur-xl shadow-xl shadow-black/20 border border-slate-700/50 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300'>
      <CardContent className='p-6'>
        <div className='flex items-start space-x-4'>
          <Avatar className='h-10 w-10'>
            <AvatarImage
              src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              alt='You'
            />
            <AvatarFallback>YU</AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className='flex flex-col w-full gap-2 mb-3'>
              <label className='text-3xl text-slate-50/75'>
                Add Post
                <span className='brand-hr'></span>
              </label>
            </div>
            <Textarea
              placeholder='The activity feed is a place to add exciting updates. Your post should not mention any external sites/payment methods or express any grievances. If you do, your account could be suspended. Please contact us if you need any help.'
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className='min-h-[120px] border-slate-600/50 bg-slate-800/50 backdrop-blur-sm text-slate-200 placeholder-slate-400 focus:border-violet-500/50 resize-none transition-all duration-200'
            />
            <div className='flex justify-between items-center mt-4'>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-slate-400 border-slate-600/50 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/5 backdrop-blur-sm transition-all duration-200'
                  asChild>
                  <label>
                    <Camera className='h-4 w-4 mr-2' />
                    Add Photos
                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={handleImageChange}
                    />
                  </label>
                </Button>
              </div>
              <Button
                disabled={!postContent.trim() || isSubmitting}
                onClick={handleSubmit}
                className='bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-medium transition-all duration-200'>
                {isSubmitting ? 'Posting...' : 'Post Listing'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
