import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from './pages/Index';
import Auth from './pages/Auth';
import SellerDashboard from './pages/SellerDashboard';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import SellerProfile from './pages/SellerProfile';
import SellerSettings from './pages/SellerSettings';
import PostPage from './pages/PostPage';
import ListingDetail from './components/ListingDetail';
import Listings from './pages/Listings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path='/auth'
                element={<Auth />}
              />
              <Route
                path='/'
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/sellerdashboard'
                element={
                  <ProtectedRoute requiredRole='SELLER'>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/messages'
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/SellerProfile'
                element={<SellerProfile />}
              />
              <Route
                path='/SellerProfile/:userId'
                element={<SellerProfile />}
              />
              <Route
                path='/BuyerSettings'
                element={<SellerSettings />}
              />
              <Route
                path='/SellerSettings'
                element={
                  <ProtectedRoute requiredRole='SELLER'>
                    <SellerSettings />
                  </ProtectedRoute>
                }
              />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listing/:listingId" element={<ListingDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path='*'
                element={<NotFound />}
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
