import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantCard from '@/components/RestaurantCard'; // Custom component
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ShoppingCart, ChefHat } from 'lucide-react';

// Placeholder data for components
const featuredRestaurants = [
  { id: 'r1', name: 'The Gourmet Place', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Italian', 'Pizza'], rating: 4.7, deliveryTime: '30-40 min' },
  { id: 'r2', name: 'Quick Bites Central', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['American', 'Burgers', 'Fast Food'], rating: 4.2, deliveryTime: '20-30 min' },
  { id: 'r3', name: 'Spicy Dragon', imageUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFzaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Chinese', 'Asian'], rating: 4.5, deliveryTime: '25-35 min' },
  { id: 'r4', name: 'Vegan Delight', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnYW4lMjBmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Vegan', 'Healthy'], rating: 4.9, deliveryTime: '35-45 min' },
];

const popularCuisines = [
  { name: 'Pizza', icon: '🍕', query: 'Pizza' },
  { name: 'Burgers', icon: '🍔', query: 'Burgers' },
  { name: 'Sushi', icon: '🍣', query: 'Sushi' },
  { name: 'Indian', icon: '🍛', query: 'Indian' },
  { name: 'Mexican', icon: '🌮', query: 'Mexican' },
  { name: 'Chinese', icon: '🍜', query: 'Chinese' },
];

const Homepage = () => {
  console.log('Homepage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/restaurant-listing?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCuisineSearch = (cuisineQuery: string) => {
    navigate(`/restaurant-listing?cuisine=${encodeURIComponent(cuisineQuery)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* AppHeader Equivalent */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center text-2xl font-bold text-orange-600">
              <ChefHat className="h-8 w-8 mr-2" />
              FoodFleet
            </Link>
            <nav className="flex items-center space-x-4">
              <Link
                to="/restaurant-listing"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Restaurants
              </Link>
              <Link
                to="/cart"
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors p-2 rounded-md hover:bg-orange-50"
              >
                <ShoppingCart className="h-5 w-5 mr-1" />
                Cart
              </Link>
              {/* Future: Add User Profile/Login Button */}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Search */}
        <section
          className="py-16 md:py-24 bg-cover bg-center text-white"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
              Your next meal, delivered.
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
              Discover local restaurants and enjoy your favorite food at home.
            </p>
            <form
              onSubmit={handleSearch}
              className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
            >
              <Input
                type="search"
                placeholder="Search for restaurants or dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-lg flex-grow !ring-offset-0 !ring-0 focus:!ring-2 focus:!ring-orange-500"
                aria-label="Search for food or restaurants"
              />
              <Button type="submit" size="lg" className="h-12 bg-orange-600 hover:bg-orange-700 text-lg">
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </form>
          </div>
        </section>

        {/* Popular Cuisines Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
              Browse by Popular Cuisines
            </h2>
            <ScrollArea className="w-full pb-4">
              <div className="flex gap-4 justify-center flex-wrap">
                {popularCuisines.map((cuisine) => (
                  <Button
                    key={cuisine.name}
                    variant="outline"
                    className="h-auto py-3 px-6 text-base flex-col sm:flex-row items-center gap-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                    onClick={() => handleCuisineSearch(cuisine.query)}
                  >
                    <span className="text-2xl" role="img" aria-label={cuisine.name}>{cuisine.icon}</span>
                    <span>{cuisine.name}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </section>

        {/* Featured Restaurants Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
              Featured Restaurants
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {featuredRestaurants.map((restaurant) => (
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
            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/restaurant-listing')}
                className="border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              >
                View All Restaurants
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* AppFooter Equivalent */}
      <footer className="py-8 bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <Link to="/" className="hover:text-orange-400 px-2">Home</Link> |
            <Link to="/restaurant-listing" className="hover:text-orange-400 px-2">Restaurants</Link> |
            <Link to="/cart" className="hover:text-orange-400 px-2">My Cart</Link> |
            <a href="#" className="hover:text-orange-400 px-2">Terms of Service</a> |
            <a href="#" className="hover:text-orange-400 px-2">Privacy Policy</a>
          </div>
          <p>&copy; {new Date().getFullYear()} FoodFleet. All rights reserved.</p>
          <p className="text-sm mt-2">Your favorite food, delivered to your door.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;