import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopNavbar from '@/components/TopNavbar';
import CategoryNavbar from '@/components/CategoryNavbar';
import BottomNavbar from '@/components/BottomNavbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import ListingsGrid from '@/components/ListingsGrid';

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const category = searchParams.get('category') || undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  return (
    <>
      <TopNavbar />
      <div className='mt-[65px]'>
      <CategoryNavbar />
      </div>
      
      <div className="container py-4">
        <div className="flex flex-col space-y-4">
          <form onSubmit={handleSearch} className="flex flex-row justify-center">
            <Input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border-slate-700 max-w-[50%]"
            />
            <Button type="submit" variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" className="border-slate-700">
              <Filter className="h-4 w-4" />
            </Button>
          </form>
          
          <div>
            <h1 className="text-2xl font-bold mb-4">
              {category ? `${category} Listings` : 'All Listings'}
            </h1>
            <ListingsGrid category={category} />
          </div>
        </div>
      </div>
      
      <BottomNavbar />
    </>
  );
};

export default Listings;