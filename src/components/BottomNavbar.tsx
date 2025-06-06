import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  MessageCircle,
  User,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BottomNavbar = () => {
  const location = useLocation();
  const { userRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      show: true,
    },
    {
      name: 'Search',
      path: '/search',
      icon: Search,
      show: true,
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageCircle,
      show: true,
    },
    {
      name: 'Dashboard',
      path: '/seller-dashboard',
      icon: LayoutDashboard,
      show: userRole === 'SELLER',
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      show: userRole === 'SELLER', // Updated to only show for sellers
    },
  ];

  const visibleItems = navItems.filter((item) => item.show);

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-50 md:hidden'>
      <div className='flex items-center justify-around px-2 py-2'>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                active
                  ? 'text-violet-400 bg-violet-900/20'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
              }`}>
              <Icon className='h-5 w-5' />
              <span className='text-xs mt-1 font-medium'>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;
