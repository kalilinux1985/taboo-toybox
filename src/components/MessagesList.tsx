import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Conversation {
  id: string;
  user: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
}

const MessagesList = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  // Fetch conversations
  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      const { data: chats, error } = await supabase
        .from('chats')
        .select(
          `
          id,
          user1_id,
          user2_id,
          users!chats_user1_id_fkey(username, avatar_url),
          users!chats_user2_id_fkey(username, avatar_url)
        `
        )
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      const { data: lastMessages } = await supabase
        .from('messages')
        .select('chat_id, content, timestamp')
        .order('timestamp', { ascending: false });

      const userMap = new Map();
      chats.forEach((chat) => {
        const otherUserId =
          chat.user1_id === user.id ? chat.user2_id : chat.user1_id;
        const otherUser =
          chat.user1_id === user.id ? chat.users[1] : chat.users[0];
        const lastMessage = lastMessages?.find(
          (msg) => msg.chat_id === chat.id
        );

        userMap.set(chat.id, {
          id: chat.id,
          user: otherUser?.username || 'Unknown',
          avatar: otherUser?.avatar_url || '',
          lastMessage: lastMessage?.content || 'No messages yet',
          time: lastMessage
            ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
          unread: 0,
          online: false,
        });
      });

      setConversations(Array.from(userMap.values()));
      if (userMap.size > 0) {
        setSelectedChat(userMap.values().next().value.id);
      }
    };

    fetchConversations();

    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat || !user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(
          'id, sender_id, content, timestamp, users!messages_sender_id_fkey(username)'
        )
        .eq('chat_id', selectedChat)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      const formattedMessages: Message[] = data.map((msg) => ({
        id: msg.id,
        sender: msg.users?.username || 'Unknown',
        content: msg.content,
        time: new Date(msg.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isMe: msg.sender_id === user.id,
      }));

      setMessages(formattedMessages);
    };

    fetchMessages();

    const subscription = supabase
      .channel(`messages:${selectedChat}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${selectedChat}`,
        },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedChat, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedChat) return;

    const { error } = await supabase.from('messages').insert({
      chat_id: selectedChat,
      sender_id: user.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]'>
      <Card className='bg-card/50 border-border/50 lg:col-span-1'>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search conversations...'
              className='pl-10'
            />
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='space-y-1'>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`flex items-center space-x-3 p-4 cursor-pointer transition-colors ${
                  selectedChat === conversation.id
                    ? 'bg-violet-500/20'
                    : 'hover:bg-muted/50'
                }`}>
                <div className='relative'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.user
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background'></div>
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-start'>
                    <p className='font-medium text-sm truncate'>
                      {conversation.user}
                    </p>
                    <div className='flex items-center space-x-2'>
                      <span className='text-xs text-muted-foreground'>
                        {conversation.time}
                      </span>
                      {conversation.unread > 0 && (
                        <Badge
                          variant='destructive'
                          className='h-5 w-5 flex items-center justify-center p-0 text-xs'>
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground truncate'>
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className='bg-card/50 border-border/50 lg:col-span-2 flex flex-col'>
        <CardHeader className='border-b border-border/50'>
          <div className='flex items-center space-x-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={
                  conversations.find((c) => c.id === selectedChat)?.avatar || ''
                }
              />
              <AvatarFallback>
                {conversations
                  .find((c) => c.id === selectedChat)
                  ?.user.split(' ')
                  .map((n) => n[0])
                  .join('') || ''}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='font-medium'>
                {conversations.find((c) => c.id === selectedChat)?.user || ''}
              </p>
              <p className='text-sm text-muted-foreground'>
                {conversations.find((c) => c.id === selectedChat)?.online
                  ? 'Online'
                  : 'Last seen 2 hours ago'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className='flex-1 p-4 overflow-y-auto'>
          <div className='space-y-4'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isMe ? 'justify-end' : 'justify-start'
                }`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isMe
                      ? 'bg-violet-600 text-white'
                      : 'bg-muted text-foreground'
                  }`}>
                  <p className='text-sm'>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isMe ? 'text-violet-100' : 'text-muted-foreground'
                    }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <div className='p-4 border-t border-border/50'>
          <div className='flex space-x-2'>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='Type a message...'
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className='flex-1'
            />
            <Button
              onClick={handleSendMessage}
              className='bg-violet-600 hover:bg-violet-700'>
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MessagesList;
