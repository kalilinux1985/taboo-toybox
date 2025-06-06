import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Plus, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import CategoryNavbar from '../components/CategoryNavbar';
import BottomNavbar from '../components/BottomNavbar';
import CreatePost from '../components/CreatePost';
import ActivityFeed from '../components/SellerDash';

const SellerDashboard = () => {
  const { user, signOut } = useAuth();
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      {/* Top Navigation - Hidden on mobile */}
      <div className='hidden lg:block'>
        <TopNavbar />
        <CategoryNavbar />
      </div>

      {/* Main Content */}
      <main className='lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Activity Feed */}
          <div className='lg:col-span-2 space-y-6'>
            <CreatePost />
            <ActivityFeed />
          </div>

          {/* Right Column - Quick Actions and Buyers you may want to follow */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Quick Actions */}
            <Card className='bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl shadow-black/20'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-white text-lg font-semibold flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5 text-violet-400' />
                  Quick Actions
                </CardTitle>
                <CardDescription className='text-slate-400 text-sm'>
                  Manage your products and listings
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button className='w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-medium transition-all duration-200'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add New Product
                </Button>
                <Button
                  variant='outline'
                  className='w-full border-slate-600/50 text-slate-300 hover:bg-slate-800/50 hover:border-violet-700 backdrop-blur-sm transition-all duration-200'>
                  <Package className='h-4 w-4 mr-2' />
                  View All Products
                </Button>
                <Button
                  variant='outline'
                  className='w-full border-slate-600/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 backdrop-blur-sm transition-all duration-200'>
                  <ShoppingCart className='h-4 w-4 mr-2' />
                  Manage Orders
                </Button>
              </CardContent>
            </Card>

            {/* Buyers you may want to follow */}
            <Card className='bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl shadow-black/20'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-white text-lg font-semibold'>
                  Buyers you may want to follow
                </CardTitle>
                <CardDescription className='text-slate-400 text-sm'>
                  Connect with potential customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-200'>
                    <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg'>
                      <span className='text-white text-sm font-bold'>MC</span>
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm text-slate-200 font-semibold'>
                        Manufacturing Corp
                      </p>
                      <p className='text-xs text-slate-400'>
                        Regular buyer • Industrial Equipment
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
                    <div className='w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg'>
                      <span className='text-white text-sm font-bold'>CS</span>
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm text-slate-200 font-semibold'>
                        Construction Solutions
                      </p>
                      <p className='text-xs text-slate-400'>
                        Active buyer • Raw Materials
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
                    <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg'>
                      <span className='text-white text-sm font-bold'>OE</span>
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm text-slate-200 font-semibold'>
                        Office Enterprises
                      </p>
                      <p className='text-xs text-slate-400'>
                        Frequent buyer • Office Supplies
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Visible only on mobile */}
      <div className='lg:hidden'>
        <BottomNavbar />
      </div>
    </div>
  );
};
export default SellerDashboard;
