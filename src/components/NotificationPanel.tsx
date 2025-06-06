import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Heart, MessageCircle, User } from 'lucide-react';

const NotificationPanel = () => {
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      message: 'liked your listing "Premium Software License"',
      time: '2 min ago',
      unread: true,
    },
    {
      id: 2,
      type: 'message',
      user: 'Mike Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      message: 'sent you a message about consulting services',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 3,
      type: 'follow',
      user: 'Emma Wilson',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      message: 'started following you',
      time: '1 hour ago',
      unread: false,
    },
  ];
  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className='h-4 w-4 text-red-500' />;
      case 'message':
        return <MessageCircle className='h-4 w-4 text-blue-500' />;
      case 'follow':
        return <User className='h-4 w-4 text-green-500' />;
      default:
        return <Bell className='h-4 w-4' />;
    }
  };
  return (
    <Card className='bg-card/50 border-border/50 my-[70px]'>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <Bell className='h-5 w-5' />
          <span>Notifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
              notification.unread
                ? 'bg-violet-500/10 border border-violet-500/20'
                : 'hover:bg-muted/50'
            }`}>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={notification.avatar} />
              <AvatarFallback>
                {notification.user
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center space-x-2'>
                {getIcon(notification.type)}
                <span className='font-medium text-sm'>{notification.user}</span>
                {notification.unread && (
                  <Badge
                    variant='secondary'
                    className='text-xs px-1.5 py-0.5'>
                    New
                  </Badge>
                )}
              </div>
              <p className='text-sm text-muted-foreground mt-1'>
                {notification.message}
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                {notification.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
export default NotificationPanel;
