// src/components/SellerProfileAbout.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SellerProfileAboutProps {
  userId?: string;
}

// Helper functions to map codes to readable values
const mapGender = (code: string): string => {
  const genderMap: Record<string, string> = {
    F: 'Female',
    M: 'Male',
    T: 'Transgender',
    O: 'Other',
  };
  return genderMap[code] || code;
};

const mapEthnicity = (code: string): string => {
  const ethnicityMap: Record<string, string> = {
    AR: 'Arab',
    A: 'Asian',
    B: 'Black',
    C: 'Caucasian (White)',
    L: 'Latin',
    M: 'Mixed',
  };
  return ethnicityMap[code] || code;
};

const mapBodySize = (code: string): string => {
  const bodySizeMap: Record<string, string> = {
    S: 'Slim / Slender',
    A: 'Athletic / Toned',
    M: 'Average',
    G: 'Muscular',
    C: 'Curvy',
    L: 'Big & Beautiful',
  };
  return bodySizeMap[code] || code;
};

const mapShoeSize = (code: string): string => {
  const shoeSizeMap: Record<string, string> = {
    '4': 'US 4, UK 2, EU 34',
    '5': 'US 5, UK 3, EU 36',
    '6': 'US 6, UK 4, EU 37',
    '7': 'US 7, UK 5, EU 38',
    '8': 'US 8, UK 6, EU 39',
    '9': 'US 9, UK 7, EU 40',
    '10': 'US 10, UK 8, EU 41',
    '11': 'US 11, UK 9, EU 42',
    '12': 'US 12, UK 10, EU 43',
    '13': 'US 13, UK 11, EU 44',
    '14': 'US 14, UK 12, EU 45',
    '15': 'US 15, UK 13, EU 46',
    '16': 'US 16+, UK 14+, EU 47+',
  };
  return shoeSizeMap[code] || code;
};

const mapOccupation = (code: string): string => {
  const occupationMap: Record<string, string> = {
    C: 'Cabin Crew',
    N: 'Nurse / Healthcare Worker',
    M: 'Model',
    F: 'Fitness Pro',
    E: 'Entrepreneur',
    T: 'Teacher',
    P: 'Stay At Home Parent',
    A: 'Military / Police',
    S: 'Student',
    O: 'Office Worker',
    B: 'Blue Collar Worker',
    D: 'Digital Nomad / Tech Guru',
  };
  return occupationMap[code] || code;
};

const mapPaymentMethod = (code: string): string => {
  const paymentMap: Record<string, string> = {
    '1': 'PayPal',
    '2': 'Venmo',
    '3': 'CashApp',
    '4': 'Amazon Gift Card',
    '5': 'Bank Transfer',
    '6': 'Stripe',
    '7': 'Google Pay',
    '8': 'Cryptocurrency',
    '9': 'Buy Me A Coffee',
    '10': 'Amazon WishList',
    '12': 'Wishlist',
    '13': 'Revolut',
  };
  return paymentMap[code] || code;
};

const mapOfferItem = (code: string): string => {
  const offerMap: Record<string, string> = {
    '5': 'Panties',
    '6': 'Thongs',
    '7': 'Lingerie',
    '8': 'Bras',
    '10': 'High Heels',
    '11': 'Flat Shoes',
    '12': 'Sneakers',
    '13': 'Slippers',
    '14': 'Uniform Shoes',
    '22': 'Boots',
    '16': 'Socks',
    '17': 'Pantyhose',
    '18': 'Stockings',
    '526': 'Buy Feet Pics',
    '527': 'Sell Feet Pics',
    '30': 'Skirts',
    '31': 'Dresses',
    '33': 'Tops',
    '34': 'Gym Clothes',
    '36': 'Other Clothing',
    '43': 'Swimwear',
    '4': 'Accessories',
    '24': 'Photo Sets',
    '25': 'Video Clips',
    '26': 'Experiences',
    '47': 'Dick Ratings',
    '48': 'Sex Toys',
    '49': 'Sexting',
    '50': 'Girlfriend Experience - GFE',
    '41': 'Instant Pics',
    '44': 'Instant Vids',
  };
  return offerMap[code] || code;
};

const SellerProfileAbout = ({ userId }: SellerProfileAboutProps) => {
  const [profileData, setProfileData] = useState({
    country: '',
    age: '',
    gender: '',
    ethnicity: '',
    body_size: '',
    shoe_size: '',
    will_show_face: false,
    occupation: '',
    accepted_payments: [] as string[],
    what_i_offer: [] as string[],
    created_at: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select(
            'country, age, gender, ethnicity, body_size, shoe_size, will_show_face, occupation, accepted_payments, what_i_offer, created_at'
          )
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (data) {
          // Parse JSON strings if needed
          const acceptedPayments =
            typeof data.accepted_payments === 'string'
              ? JSON.parse(data.accepted_payments)
              : data.accepted_payments || [];

          const whatIOffer =
            typeof data.what_i_offer === 'string'
              ? JSON.parse(data.what_i_offer)
              : data.what_i_offer || [];

          setProfileData({
            ...data,
            accepted_payments: acceptedPayments,
            what_i_offer: whatIOffer,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className='w-80'>
      <Card className='bg-slate-900 border-border/50'>
        <CardHeader className='pt-6 pl-6'>
          <CardTitle>About</CardTitle>
          <p className='about-sub-title'>
            <span className='about-followers'>164 Followers</span> -
            <span className='about-followers'> 211 Following</span> -
            <span className='about -followers'>5 Badges</span>
          </p>
        </CardHeader>
        <CardContent className='pl-6 pr-6'>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className='space-y-3 text-sm text-gray-300'>
              <div className='space-y-2'>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>Country:</span>{' '}
                  {profileData.country || 'Not specified'}
                </div>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>Age:</span>{' '}
                  {profileData.age || 'Not specified'}
                </div>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>Gender:</span>{' '}
                  {profileData.gender
                    ? mapGender(profileData.gender)
                    : 'Not specified'}
                </div>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>Ethnicity:</span>{' '}
                  {profileData.ethnicity
                    ? mapEthnicity(profileData.ethnicity)
                    : 'Not specified'}
                </div>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>Body Size:</span>{' '}
                  {profileData.body_size
                    ? mapBodySize(profileData.body_size)
                    : 'Not specified'}
                </div>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>Shoe Size:</span>{' '}
                  {profileData.shoe_size
                    ? mapShoeSize(profileData.shoe_size)
                    : 'Not specified'}
                </div>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>Shows Face:</span>{' '}
                  {profileData.will_show_face ? 'Yes' : 'No'}
                </div>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>Occupation:</span>{' '}
                  {profileData.occupation
                    ? mapOccupation(profileData.occupation)
                    : 'Not specified'}
                </div>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>Payment Methods:</span>{' '}
                  {profileData.accepted_payments &&
                  profileData.accepted_payments.length > 0
                    ? profileData.accepted_payments
                        .map((code) => mapPaymentMethod(code))
                        .join(', ')
                    : 'Not specified'}
                </div>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>What I Offer:</span>{' '}
                  {profileData.what_i_offer &&
                  profileData.what_i_offer.length > 0
                    ? profileData.what_i_offer
                        .map((code) => mapOfferItem(code))
                        .join(', ')
                    : 'Not specified'}
                </div>
                <div className='w-full flex flex-row justify-between'>
                  <span className='text-white'>Joined:</span>{' '}
                  {formatDate(profileData.created_at)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerProfileAbout;
