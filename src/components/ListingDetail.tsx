import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bookmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  payment_methods: string[];
  created_at: string;
  seller_id: string;
  seller: {
    id: string;
    username: string;
    avatar_url: string;
    role: string;
    country: string;
    rating: number;
    review_count: number;
    is_verified: boolean;
    is_premium: boolean;
  };
}

const ListingDetail = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            seller:seller_id (*)
          `)
          .eq('id', listingId)
          .single();

        if (error) throw error;
        
        if (data) {
          setListing(data);
          if (data.images && data.images.length > 0) {
            setMainImage(data.images[0]);
          }
        }
      } catch (error: any) {
        console.error('Error fetching listing:', error);
        toast({
          title: 'Error',
          description: 'Failed to load listing details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    // Check if listing is saved
    const checkSavedStatus = async () => {
      if (!user || !listingId) return;
      
      try {
        const { data, error } = await supabase
          .from('saved_listings')
          .select('id')
          .eq('user_id', user.id)
          .eq('listing_id', listingId)
          .single();
          
        if (!error && data) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    fetchListing();
    checkSavedStatus();
  }, [listingId, user, toast]);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save listings',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isSaved) {
        // Remove from saved listings
        await supabase
          .from('saved_listings')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
      } else {
        // Add to saved listings
        await supabase.from('saved_listings').insert({
          user_id: user.id,
          listing_id: listingId,
          created_at: new Date().toISOString(),
        });
      }

      setIsSaved(!isSaved);
      toast({
        title: isSaved ? 'Listing removed' : 'Listing saved',
        description: isSaved
          ? 'Listing removed from your saved items'
          : 'Listing added to your saved items',
      });
    } catch (error) {
      console.error('Error saving listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to save listing',
        variant: 'destructive',
      });
    }
  };

  const handleImageClick = (image: string) => {
    setMainImage(image);
  };

  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <p>Loading listing details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-10 flex justify-center">
        <p>Listing not found</p>
      </div>
    );
  }

  return (
    <>
      <TopNavbar />
      <div className="container py-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-bold mb-1">{listing.title}</h1>
            <div className="relative mb-3 mt-1">
              <img
                className="w-full h-auto rounded-md object-cover max-h-[500px]"
                alt={`${listing.title} main photo`}
                src={mainImage}
              />
            </div>
            
            {listing.images && listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {listing.images.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-md">
                    <img
                      loading="lazy"
                      className={`w-full h-full object-cover cursor-pointer transition-all ${mainImage === image ? 'ring-2 ring-violet-500' : 'hover:opacity-80'}`}
                      src={image}
                      alt={`${listing.title} thumbnail ${index + 1}`}
                      onClick={() => handleImageClick(image)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-5">
            <Card className="border border-slate-700 shadow-sm">
              <div className="bg-slate-800">
                <div className="p-4 pb-2 mb-2 relative">
                  <div className="flex items-start space-x-3">
                    <Link to={`/profile/${listing.seller.id}`} className="block">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={listing.seller.avatar_url} />
                        <AvatarFallback>{listing.seller.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    
                    <div className="flex-1">
                      {listing.seller.is_premium && (
                        <p className="text-xs mb-1">
                          <Badge className="bg-gradient-to-r from-violet-500 to-violet-600 text-white border-0">
                            Premium seller
                          </Badge>
                        </p>
                      )}
                      
                      <Link to={`/profile/${listing.seller.id}`}>
                        <h4 className="font-semibold flex items-center">
                          {listing.seller.username.length > 12
                            ? `${listing.seller.username.substring(0, 12)}...`
                            : listing.seller.username}
                          {listing.seller.country && (
                            <img
                              className="rounded-full ml-1 w-4 h-4"
                              src={`/icons/countries/${listing.seller.country.toLowerCase()}.png`}
                              alt={listing.seller.country}
                            />
                          )}
                        </h4>
                      </Link>
                      
                      <p className="text-xs space-x-3">
                        <span className="inline-flex items-center">
                          <span className="text-yellow-400 mr-1">★</span> 
                          {listing.seller.rating.toFixed(1)}
                          <span className="text-slate-400 ml-1">({listing.seller.review_count})</span>
                        </span>
                        
                        {listing.seller.is_verified && (
                          <span className="inline-flex items-center">
                            <span className="text-green-400 mr-1">✓</span> ID Verified
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="expanding-text mb-4">
                  {listing.description}
                </div>
                
                <span className="float-right cursor-pointer" onClick={handleSave}>
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current text-violet-400' : 'text-slate-400'}`} />
                </span>
                
                <p className="text-2xl font-bold mb-3 mt-3">
                  {listing.price.toFixed(2)} <span className="text-sm">{listing.currency}</span>
                </p>
                
                <hr className="border-slate-700 my-3" />
                
                {listing.payment_methods && listing.payment_methods.length > 0 && (
                  <>
                    <h4 className="font-semibold mb-2">Payment Methods</h4>
                    <p className="mb-3">
                      {listing.payment_methods.map((method) => (
                        <Badge key={method} className="mr-1 mb-1 bg-primary text-white">
                          {method}
                        </Badge>
                      ))}
                    </p>
                    <hr className="border-slate-700 my-3" />
                  </>
                )}
                
                <Button 
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800"
                  asChild
                >
                  <Link to={`/message/${listing.seller.id}?listing=${listing.id}`}>
                    Message Seller
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </>
  );
};

export default ListingDetail;