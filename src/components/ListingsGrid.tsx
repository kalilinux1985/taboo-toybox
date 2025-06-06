import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface ListingPreview {
  id: string;
  title: string;
  price: number;
  currency: string;
  images: string[];
  seller_id: string;
  seller: {
    username: string;
    avatar_url: string;
    is_premium: boolean;
  };
}

interface ListingsGridProps {
  category?: string;
  sellerId?: string;
  limit?: number;
}

const ListingsGrid = ({ category, sellerId, limit = 12 }: ListingsGridProps) => {
  const [listings, setListings] = useState<ListingPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        let query = supabase
          .from('products')
          .select(`
            id,
            title,
            price,
            currency,
            images,
            seller_id,
            seller:seller_id (username, avatar_url, is_premium)
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (category) {
          query = query.eq('category', category);
        }

        if (sellerId) {
          query = query.eq('seller_id', sellerId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setListings(data ? (data as unknown as ListingPreview[]) : []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category, sellerId, limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-slate-800">
            <div className="h-40 bg-slate-700"></div>
            <CardContent className="p-3">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return <p className="text-center py-8">No listings found</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <Link to={`/listing/${listing.id}`} key={listing.id}>
          <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-200 border border-slate-700 bg-slate-800">
            <div className="aspect-square overflow-hidden relative">
              <img
                src={listing.images?.[0] || '/placeholder.svg'}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {listing.seller.is_premium && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white border-0">
                  Premium
                </Badge>
              )}
            </div>
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={listing.seller.avatar_url} />
                  <AvatarFallback>{listing.seller.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-slate-300 truncate">
                  {listing.seller.username}
                </span>
              </div>
              <h3 className="font-medium text-sm line-clamp-1">{listing.title}</h3>
              <p className="font-bold text-sm mt-1">
                {listing.price.toFixed(2)} <span className="text-xs">{listing.currency}</span>
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ListingsGrid;