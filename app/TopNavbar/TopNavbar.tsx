'use client'

// src/components/TopNavbar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageSquare, Search, User, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/Authcontexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface RecentMessage {
  id: string;
  user: string;
  content: string;
  time: string;
}

interface UserProfile {
  username: string;
  avatar_url?: string;
}

const Navbar = () => {
  const [notifications] = useState(3);
  const [messages, setMessages] = useState<RecentMessage[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user, signOut, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    // Fetch user profile including avatar_url
    const fetchUserProfile = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          return;
        }

        if (profileData) {
          setUserProfile(profileData);

          // If avatar_url exists in the profile, handle different formats
          if (profileData.avatar_url) {
            // Check if it's already a full URL
            if (profileData.avatar_url.startsWith('http')) {
              setAvatarUrl(profileData.avatar_url);
              console.log('Using direct avatar URL:', profileData.avatar_url);
            } else {
              // Otherwise treat it as a path in the avatars bucket
              try {
                const { data: avatarData } = await supabase
                  .storage
                  .from('avatars')
                  .getPublicUrl(profileData.avatar_url);
                
                console.log('Generated avatar URL:', avatarData.publicUrl);
                setAvatarUrl(avatarData.publicUrl);
              } catch (storageError) {
                console.error('Error getting avatar URL:', storageError);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
      }
    };

    fetchUserProfile();

    const fetchRecentMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(
          `
          id,
          sender_id,
          content,
          timestamp,
          users:sender_id (username),
          chats:chat_id (user1_id, user2_id)
        `
        )
        .neq('sender_id', user.id)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`, {
          referencedTable: 'chats',
        })
        .order('timestamp', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent messages:', error);
        return;
      }

      const formattedMessages: RecentMessage[] = data.map((msg: { id: any; sender_id: any; content: any; timestamp: any; users: { username: any }[]; chats: { user1_id: any; user2_id: any }[] }) => ({
        id: msg.id,
        user: msg.users[0]?.username || 'Unknown',
        content: msg.content,
        time: new Date(msg.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setMessages(formattedMessages);
    };

    fetchRecentMessages();

    const subscription = supabase
      .channel('recent-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => fetchRecentMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  // Categories from the image
  const categories = [
    { name: 'USED UNDIES', path: '/category/undies' },
    { name: 'USED SHOES', path: '/category/shoes' },
    { name: 'USED HOSIERY', path: '/category/hosiery' },
    { name: 'USED CLOTHS', path: '/category/cloths' },
    { name: 'NAUGHTY EXTRAS', path: '/category/extras' },
  ];

  return (
    <nav className='fixed max-h-16 top-0 z-50 w-full border-b border-slate-800 bg-[#020617] backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='top-navbar flex h-16 items-center px-4'>
        {/* Search Bar */}
        <div className='flex items-center ml-4'>
          <div className='relative flex items-center'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search...'
              className='pl-10 bg-[#0f172a] border-slate-700 w-[200px] focus:border-violet-500 text-white'
            />
          </div>
        </div>

        {/* Categories */}
        <div className='flex items-center space-x-1 ml-8'>
          {categories.map((category) => (
            <Button
              key={category.name}
              variant='ghost'
              className='text-violet-400 hover:text-violet-300 hover:bg-transparent font-medium text-xs'
              onClick={() => navigate(category.path)}
            >
              {category.name} <ChevronDown className='ml-1 h-4 w-4' />
            </Button>
          ))}
        </div>

        {/* Right Side Icons */}
        <div className='flex items-center ml-auto space-x-4 mr-4'>
          {/* Messages */}
          <Button
            variant='ghost'
            size='icon'
            className='text-white hover:bg-transparent'>
            <MessageSquare className='h-5 w-5' />
          </Button>

          {/* Notifications */}
          <Button
            variant='ghost'
            className='relative text-white hover:bg-transparent'>
            <Bell className='h-5 w-5' />
            {notifications > 0 && (
              <Badge
                variant='destructive'
                className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs'>
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='rounded-full p-0 h-8 w-8 overflow-hidden hover:bg-transparent'>
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="User" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vercel.svg";
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-purple-700 text-white">
                    {userProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='bg-[#0f172a] border-slate-700 text-white'>
              {userRole === 'SELLER' && (
                <>
                  <DropdownMenuItem onClick={() => navigate('/SellerProfile')} className='hover:bg-slate-700'>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/SellerSettings')} className='hover:bg-slate-700'>
                    Settings
                  </DropdownMenuItem>
                </>
              )}
              {userRole !== 'SELLER' && (
                <DropdownMenuItem onClick={() => navigate('/BuyerSettings')} className='hover:bg-slate-700'>
                  Settings
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className='bg-slate-700' />
              <DropdownMenuItem onClick={handleSignOut} className='hover:bg-slate-700'>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
