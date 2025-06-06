import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image, Film } from 'lucide-react';

const SellerProfileTabs = () => {
  // Sample data for listings
  const listings = [
    {
      id: 1,
      title: 'Listing Title',
      price: '$0.00 USD',
      seller: 'User Name',
      description: 'Description in detail of the item being sold goes here',
    },
    {
      id: 2,
      title: 'Listing Title',
      price: '$0.00 USD',
      seller: 'User Name',
      description: 'Description in detail of the item being sold goes here',
    },
  ];

  // Sample data for instant content
  const instantContent = [
    { id: 1, type: 'image' },
    { id: 2, type: 'video' },
    { id: 3, type: 'image' },
  ];

  return (
    <Tabs
      defaultValue='overview'
      className='flex flex-col w-full'>
      <TabsList className='grid w-full grid-cols-5 bg-black/50'>
        <TabsTrigger
          value='overview'
          className='bg-violet-600 text-white data-[state=active]:bg-violet-700'>
          Overview
        </TabsTrigger>
        <TabsTrigger
          value='shop'
          className='text-white data-[state=active]:bg-violet-600'>
          Shop
        </TabsTrigger>
        <TabsTrigger
          value='instant'
          className='text-white data-[state=active]:bg-violet-600'>
          Instant Content
        </TabsTrigger>
        <TabsTrigger
          value='photos'
          className='text-white data-[state=active]:bg-violet-600'>
          Photos
        </TabsTrigger>
        <TabsTrigger
          value='reviews'
          className='text-white data-[state=active]:bg-violet-600'>
          Reviews
        </TabsTrigger>
      </TabsList>

      {/* Shop Tab Content */}
      <TabsContent
        value='shop'
        className='mt-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-white'>
            Shop <span className='text-violet-400'>28 Listings</span>
          </h2>
          <button className='bg-violet-600 hover:bg-violet-700 text-white px-4 py-1 text-sm'>
            VIEW ALL LISTINGS
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className='bg-black/50 border-violet-500/30 overflow-hidden'>
              <div className='relative'>
                <div className='aspect-[4/3] bg-gray-700 flex items-center justify-center'>
                  <svg
                    className='w-16 h-16 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'>
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                      d='M6 20h12a2 2 0 002-2V9a2 2 0 00-2-2h-3.9a1 1 0 01-.7-.3L11.5 5H6a2 2 0 00-2 2v11a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div className='absolute bottom-2 right-2 bg-violet-600 text-white text-xs px-2 py-1 rounded-sm'>
                  {listing.seller}
                </div>
              </div>
              <CardContent className='p-4'>
                <h3 className='font-semibold text-white'>{listing.title}</h3>
                <p className='text-sm text-gray-300 mt-1'>
                  {listing.description}
                </p>
                <div className='flex justify-between items-center mt-2'>
                  <span className='text-violet-400 font-bold'>
                    {listing.price}
                  </span>
                  <button className='text-violet-400 hover:text-violet-300'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'>
                      <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'></path>
                    </svg>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Instant Content Tab */}
      <TabsContent
        value='instant'
        className='mt-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-white'>
            Instant Content <span className='text-violet-400'>3 Items</span>
          </h2>
          <button className='bg-violet-600 hover:bg-violet-700 text-white px-4 py-1 text-sm'>
            VIEW ALL CONTENT
          </button>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          {instantContent.map((item) => (
            <div
              key={item.id}
              className='bg-black/50 border border-violet-500/30 p-4 flex flex-col items-center justify-center aspect-square'>
              {item.type === 'image' ? (
                <Image className='w-12 h-12 text-violet-400' />
              ) : (
                <Film className='w-12 h-12 text-violet-400' />
              )}
              <span className='mt-2 text-white text-sm'>
                {item.type === 'image' ? 'Pics' : 'Videos'}
              </span>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Other tab contents would follow the same pattern */}
      <TabsContent value='overview'>Overview content here</TabsContent>
      <TabsContent value='photos'>Photos content here</TabsContent>
      <TabsContent value='reviews'>Reviews content here</TabsContent>
    </Tabs>
  );
};

export default SellerProfileTabs;
