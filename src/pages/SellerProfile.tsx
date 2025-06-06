import { useParams } from 'react-router-dom';
import TopNavbar from '@/components/TopNavbar';
import SellerProfileHeader from '@/components/SellerProfileHeader';
import SellerProfileAbout from '@/components/SellerProfileAbout';
import SellerProfileTabs from '@/components/SellerProfileTabs';
import { useAuth } from '@/contexts/AuthContext';

const SellerProfile = () => {
  const { userId } = useParams(); // Get userId from URL params
  const { user } = useAuth();

  // Use URL param if available, otherwise use current user's ID
  const profileId = userId || (user ? user.id : null);

  return (
    <div>
      <div className='top-nav'>
        <TopNavbar />
      </div>
      <div className='container mt-20 mx-auto p-4 space-y-6'>
        <SellerProfileHeader userId={profileId} />

        <div className='flex flex-col md:flex-row gap-6'>
          <SellerProfileAbout userId={profileId} />
          <div className='flex-1'>
            <SellerProfileTabs userId={profileId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
