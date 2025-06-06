import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, DollarSign, Grid3X3, Zap, Edit } from 'lucide-react'; // Added Edit icon
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, useNavigate } from 'react-router-dom';

// Add userId to props
const SellerProfileHeader = ({ userId }: { userId?: string }) => {
  const { user, userRole } = useAuth();
  const [username, setUsername] = useState('User Name');
  const [bio, setBio] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [profileOwnerId, setProfileOwnerId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Use the userId from props instead of hardcoded value
      const currentProfileId = userId || (user ? user.id : null);
      setProfileOwnerId(currentProfileId);

      if (!currentProfileId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('username, avatar_url, bio')
          .eq('id', currentProfileId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (data) {
          setUsername(data.username);
          setAvatarUrl(data.avatar_url);
          setBio(data.bio || '');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, userId]);

  return (
    <div className='flex gap-6'>
      <div className='w-80 rounded-full p-1'>
        <Avatar className='h-80 w-80 rounded-full'>
          <AvatarImage src={avatarUrl || '/icons/user-avatar.svg'} />
          <AvatarFallback className='text-base'>
            {username?.substring(0, 2).toUpperCase() || 'UN'}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Profile Info Card */}
      <div className='flex-1'>
        <Card className='bg-slate-900 border-violet-700/40'>
          <CardContent className='p-6 min-h-full'>
            <div className='space-y-4'>
              <div className='flex flex-col'>
                <div className='flex items-center mb-3'>
                  <Badge className='bg-transparent text-white'>
                    🔮 PREMIUM SELLER
                  </Badge>
                </div>
                <h1 className='text-3xl font-bold text-white'>
                  {isLoading ? 'Loading...' : username}
                </h1>
              </div>

              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Button className='bg-violet-600 hover:bg-violet-700 text-white px-6'>
                  <MessageSquare className='h-4 w-4 mr-2' />
                  MESSAGE SELLER
                </Button>
                <Button
                  variant='outline'
                  className='border-white text-white hover:bg-white hover:text-black px-6'>
                  <DollarSign className='h-4 w-4 mr-2' />
                  TIP
                </Button>
                {user && user.id === profileOwnerId && (
                  <Button
                    variant='ghost'
                    className='text-white px-6'
                    onClick={() => navigate('/SellerSettings')}>
                    <Edit className='h-4 w-4 mr-2' />
                    EDIT PROFILE
                  </Button>
                )}
              </div>

              <div className='flex flex-wrap gap-4'>
                <div className='flex items-center space-x-2 bg-violet-600 px-3 py-1 text-white'>
                  <Grid3X3 className='h-4 w-4' />
                  <span className='text-sm font-medium'>28 LISTINGS</span>
                </div>
                <div className='flex items-center space-x-2 bg-violet-600 px-3 py-1 text-white'>
                  <Zap className='h-4 w-4' />
                  <span className='text-sm font-medium'>INSTANT CONTENT</span>
                </div>
              </div>

              <div className='mt-2'>
                <p className='text-violet-300 text-sm'>
                  {isLoading ? 'Loading bio...' : bio ? `BIO: ${bio}` : 'No bio available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerProfileHeader;
