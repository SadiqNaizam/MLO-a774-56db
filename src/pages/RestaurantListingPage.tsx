import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Custom Components
import RestaurantCard from '@/components/RestaurantCard';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // For mobile filters

// Lucide Icons
import { Search, ListFilter, X, ShoppingCart, Star, Clock, Menu as MenuIcon, Utensils } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string; // e.g., "20-30 min"
  minOrder?: number; // Example additional filterable property
  deliveryFee?: number; // Example additional filterable property
}

const ALL_CUISINES = ['Pizza', 'Burger', 'Sushi', 'Indian', 'Italian', 'Chinese', 'Mexican', 'Vegetarian'];

const mockRestaurants: Restaurant[] = [
  { id: '1', name: 'Pizza Palace', imageUrl: 'https://source.unsplash.com/random/400x225/?pizza', cuisineTypes: ['Pizza', 'Italian'], rating: 4.5, deliveryTime: '25-35 min', minOrder: 10, deliveryFee: 2.99 },
  { id: '2', name: 'Burger Bonanza', imageUrl: 'https://source.unsplash.com/random/400x225/?burger', cuisineTypes: ['Burger', 'American'], rating: 4.2, deliveryTime: '20-30 min', minOrder: 0, deliveryFee: 1.50 },
  { id: '3', name: 'Sushi Central', imageUrl: 'https://source.unsplash.com/random/400x225/?sushi', cuisineTypes: ['Sushi', 'Japanese'], rating: 4.8, deliveryTime: '30-40 min', minOrder: 15, deliveryFee: 3.50 },
  { id: '4', name: 'Curry House', imageUrl: 'https://source.unsplash.com/random/400x225/?curry', cuisineTypes: ['Indian', 'Vegetarian'], rating: 4.6, deliveryTime: '35-45 min', minOrder: 12, deliveryFee: 2.00 },
  { id: '5', name: 'Pasta Perfection', imageUrl: 'https://source.unsplash.com/random/400x225/?pasta', cuisineTypes: ['Italian'], rating: 4.3, deliveryTime: '25-35 min', minOrder: 10, deliveryFee: 0 },
  { id: '6', name: 'Wok Wonders', imageUrl: 'https://source.unsplash.com/random/400x225/?wok,chinese', cuisineTypes: ['Chinese'], rating: 4.0, deliveryTime: '20-30 min', minOrder: 8, deliveryFee: 1.00 },
  { id: '7', name: 'Taco Town', imageUrl: 'https://source.unsplash.com/random/400x225/?taco', cuisineTypes: ['Mexican'], rating: 4.7, deliveryTime: '15-25 min', minOrder: 5, deliveryFee: 2.50 },
  { id: '8', name: 'Green Garden', imageUrl: 'https://source.unsplash.com/random/400x225/?salad,vegetarian', cuisineTypes: ['Vegetarian', 'Salad'], rating: 4.9, deliveryTime: '20-30 min', minOrder: 10, deliveryFee: 0 },
  { id: '9', name: "Luigi's Pizzeria", imageUrl: 'https://source.unsplash.com/random/400x225/?pizzeria', cuisineTypes: ['Pizza', 'Italian'], rating: 3.9, deliveryTime: '40-50 min', minOrder: 20, deliveryFee: 4.00 },
  { id: '10', name: 'The Burger Joint', imageUrl: 'https://source.unsplash.com/random/400x225/?burgers,fastfood', cuisineTypes: ['Burger'], rating: 4.1, deliveryTime: '25-35 min', minOrder: 0, deliveryFee: 3.00 },
];

const ITEMS_PER_PAGE = 6;

const RestaurantListingPage = () => {
  const location = useLocation();
  const initialSearchTerm = new URLSearchParams(location.search).get('query') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0); // 0 means any rating
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(60); // Max 60 minutes
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    console.log('RestaurantListingPage loaded');
    setSearchTerm(new URLSearchParams(location.search).get('query') || '');
  }, [location.search]);

  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  const filteredRestaurants = mockRestaurants
    .filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisineTypes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(restaurant =>
      selectedCuisines.length === 0 || selectedCuisines.some(c => restaurant.cuisineTypes.includes(c))
    )
    .filter(restaurant => restaurant.rating >= minRating)
    .filter(restaurant => {
      const deliveryTimeMaxMinutes = parseInt(restaurant.deliveryTime.split('-')[1]?.replace(' min', '') || '0', 10);
      return deliveryTimeMaxMinutes <= maxDeliveryTime;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'deliveryTime') {
        const timeA = parseInt(a.deliveryTime.split('-')[0] || '0', 10);
        const timeB = parseInt(b.deliveryTime.split('-')[0] || '0', 10);
        return timeA - timeB;
      }
      // Add more sort options if needed (e.g. relevance - could be more complex)
      return 0; // Default: no specific sort beyond initial filtering
    });

  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
  const currentRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };
  
  const FilterControls = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ListFilter className="mr-2 h-5 w-5" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sort-by" className="text-sm font-medium">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-by" className="w-full mt-1">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
                <SelectItem value="deliveryTime">Delivery Time (Fastest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-2">Cuisine</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {ALL_CUISINES.map(cuisine => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cuisine-${cuisine}`}
                    checked={selectedCuisines.includes(cuisine)}
                    onCheckedChange={() => handleCuisineChange(cuisine)}
                  />
                  <Label htmlFor={`cuisine-${cuisine}`} className="font-normal cursor-pointer">{cuisine}</Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <Label htmlFor="rating-slider" className="text-sm font-medium">Minimum Rating: {minRating.toFixed(1)} <Star className="inline h-4 w-4 fill-yellow-400 text-yellow-500" /></Label>
            <Slider
              id="rating-slider"
              min={0}
              max={5}
              step={0.1}
              defaultValue={[minRating]}
              onValueChange={(value) => setMinRating(value[0])}
              className="mt-2"
            />
          </div>
          <Separator />
          <div>
            <Label htmlFor="delivery-slider" className="text-sm font-medium">Max. Delivery Time: {maxDeliveryTime} min <Clock className="inline h-4 w-4" /></Label>
            <Slider
              id="delivery-slider"
              min={15}
              max={60}
              step={5}
              defaultValue={[maxDeliveryTime]}
              onValueChange={(value) => setMaxDeliveryTime(value[0])}
              className="mt-2"
            />
          </div>
          <Button variant="outline" onClick={() => {
            setSelectedCuisines([]);
            setMinRating(0);
            setMaxDeliveryTime(60);
            setSortBy('relevance');
          }} className="w-full mt-4">
            <X className="mr-2 h-4 w-4" /> Reset Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* AppHeader Placeholder */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            <Utensils className="h-8 w-8" />
            <span>FoodFleet</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsFiltersOpen(true)}>
              <ListFilter className="h-6 w-6" />
            </Button>
            <Link to="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {/* Basic cart count placeholder */}
                {/* <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span> */}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search restaurants or cuisines (e.g. Pizza, Sushi...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-base py-6 rounded-lg shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {searchTerm && (
             <p className="text-sm text-muted-foreground mt-2">
                Showing results for "{searchTerm}"
             </p>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5 space-y-6">
            <FilterControls />
          </aside>

          {/* Mobile Filters Sheet */}
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0">
                <div className="p-6 h-full overflow-y-auto">
                    <FilterControls />
                </div>
            </SheetContent>
          </Sheet>


          <main className="w-full md:w-3/4 lg:w-4/5">
            {currentRestaurants.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentRestaurants.map(restaurant => (
                    <RestaurantCard
                      key={restaurant.id}
                      id={restaurant.id}
                      name={restaurant.name}
                      imageUrl={restaurant.imageUrl}
                      cuisineTypes={restaurant.cuisineTypes}
                      rating={restaurant.rating}
                      deliveryTime={restaurant.deliveryTime}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        // Basic pagination display logic (show first, last, current, and neighbors)
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          (page === currentPage - 2 && page !== 1) ||
                          (page === currentPage + 2 && page !== totalPages)
                        ) {
                          return <PaginationEllipsis key={`ellipsis-${page}`} />;
                        }
                        return null;
                      })}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <Card className="text-center py-12">
                <CardHeader>
                  <CardTitle className="text-2xl">No Restaurants Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                  <Button variant="link" onClick={() => {
                    setSearchTerm('');
                    setSelectedCuisines([]);
                    setMinRating(0);
                    setMaxDeliveryTime(60);
                    setSortBy('relevance');
                    setCurrentPage(1);
                  }}>Clear all filters</Button>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* AppFooter Placeholder */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} FoodFleet Inc. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/about" className="hover:text-white">About Us</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantListingPage;