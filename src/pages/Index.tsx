import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Star, TrendingUp } from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import CategoryNavbar from '../components/CategoryNavbar';
import CreatePost from '../components/CreatePost';
import ActivityFeed from '../components/SellerDash';
import BottomNavbar from '../components/BottomNavbar';

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      {/* Top Navigation - Hidden on mobile */}
      <div className='hidden lg:block'>
        <TopNavbar />
        <CategoryNavbar />
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-4 py-6 pb-20 lg:pb-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <CreatePost />
            <ActivityFeed />
          </div>
          <div className='hidden lg:block'>
            <div className='bg-slate-900/50 backdrop-blur-xl shadow-xl shadow-black/20 p-6 sticky top-6 rounded-lg border border-slate-700/50'>
              <div className='flex items-center gap-2 mb-4'>
                <Star className='h-5 w-5 text-violet-400' />
                <h3 className='font-semibold text-slate-200 text-lg'>
                  Top Sellers
                </h3>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-200'>
                  <div className='w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg'>
                    <span className='text-white text-sm font-bold'>TC</span>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm text-slate-200 font-semibold'>
                      TechCorp Industries
                    </p>
                    <p className='text-xs text-slate-400'>
                      4.9 rating • 2.3k sales
                    </p>
                  </div>
                  <Button
                    size='sm'
                    variant='outline'
                    className='border-violet-600/50 text-violet-300 hover:bg-violet-600/10 hover:border-violet-500 text-xs font-medium'>
                    Follow
                  </Button>
                </div>
                <div className='flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-200'>
                  <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg'>
                    <span className='text-white text-sm font-bold'>GM</span>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm text-slate-200 font-semibold'>
                      Global Materials Co.
                    </p>
                    <p className='text-xs text-slate-400'>
                      4.8 rating • 1.8k sales
                    </p>
                  </div>
                  <Button
                    size='sm'
                    variant='outline'
                    className='border-violet-600/50 text-violet-300 hover:bg-violet-600/10 hover:border-violet-500 text-xs font-medium'>
                    Follow
                  </Button>
                </div>
                <div className='flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-200'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg'>
                    <span className='text-white text-sm font-bold'>BS</span>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm text-slate-200 font-semibold'>
                      BuildTech Systems
                    </p>
                    <p className='text-xs text-slate-400'>
                      4.7 rating • 1.5k sales
                    </p>
                  </div>
                  <Button
                    size='sm'
                    variant='outline'
                    className='border-violet-600/50 text-violet-300 hover:bg-violet-600/10 hover:border-violet-500 text-xs font-medium'>
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Visible only on mobile */}
      <div className='lg:hidden'>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Index;
