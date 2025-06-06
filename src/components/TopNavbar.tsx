// src/components/TopNavbar.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageSquare, Newspaper, Search, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface RecentMessage {
  id: string;
  user: string;
  content: string;
  time: string;
}

const Navbar = () => {
  const [notifications] = useState(3);
  const [messages, setMessages] = useState<RecentMessage[]>([]);
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

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

      const formattedMessages: RecentMessage[] = data.map((msg) => ({
        id: msg.id,
        user: msg.users?.username || 'Unknown',
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
    navigate('/');
  };

  return (
    <nav className='fixed max-h-16 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 justify-between items-center px-4 w-full m-auto max-w-[85%]'>
        <div className='flex items-center space-x-4'>
          <div className='h-12 w-auto flex flex-row items-center'>
            <img
              src='logo.png'
              alt='Logo'
              className='h-12 w-auto'
            />
          </div>
        </div>

        <div className='flex-1 max-w-sm mx-8'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search listings, users...'
              className='pl-10 bg-muted/50 border-border/50 focus:border-violet-500'
            />
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            className='relative flex flex-col'
            onClick={() => navigate('/SellerDashboard')}>
            <Newspaper
              size={32}
              strokeWidth={1.75}
              className='bg-[#7c3aed00] hover:bg-accent-[#7c3aed00]'
            />
          </Button>
          <Button
            variant='ghost'
            className='relative'>
            <Bell className='h-5 w-5' />
            {notifications > 0 && (
              <Badge
                variant='destructive'
                className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs'>
                {notifications}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='relative'>
                <MessageSquare className='h-5 w-5' />
                {messages.length > 0 && (
                  <Badge
                    variant='destructive'
                    className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs'>
                    {messages.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-64 bg-popover border-border'>
              {messages.length === 0 ? (
                <DropdownMenuItem>No new messages</DropdownMenuItem>
              ) : (
                messages.map((message) => (
                  <DropdownMenuItem
                    key={message.id}
                    onClick={() => navigate('/messages')}>
                    <div className='flex flex-col w-full'>
                      <p className='font-medium text-sm truncate'>
                        {message.user}
                      </p>
                      <p className='text-sm text-muted-foreground truncate'>
                        {message.content}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {message.time}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              {messages.length > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => navigate('/messages')}
                className='justify-center'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full bg-violet-600 text-white hover:bg-violet-700'>
                  View All Messages
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full'>
                <User className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {userRole === 'SELLER' && (
                <>
                  <DropdownMenuItem onClick={() => navigate('/SellerProfile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/SellerSettings')}>
                    Settings
                  </DropdownMenuItem>
                </>
              )}
              {userRole !== 'SELLER' && (
                <DropdownMenuItem onClick={() => navigate('/BuyerSettings')}>
                  Settings
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
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
