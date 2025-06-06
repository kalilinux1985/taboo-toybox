import TopNavbar from '@/components/TopNavbar';
import MessagesList from '@/components/MessagesList';

const Messages = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-violet-900/20'>
      <TopNavbar />

      <div className='container mx-auto px-4 py-6'>
        <h1 className='text-2xl font-bold mb-6'>Messages</h1>
        <MessagesList />
      </div>
    </div>
  );
};

export default Messages;
