import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "25-35 min"
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
}) => {
  console.log('RestaurantCard loaded for:', name);

  return (
    <Link to={`/restaurant-menu?restaurantId=${id}`} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
      <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg group-hover:border-primary">
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || 'https://via.placeholder.com/400x225?text=Restaurant'}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <CardTitle className="text-xl font-semibold line-clamp-1 group-hover:text-primary">
            {name}
          </CardTitle>
          
          {cuisineTypes && cuisineTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {cuisineTypes.slice(0, 3).map((cuisine) => ( // Show max 3 cuisine types
                <Badge key={cuisine} variant="secondary" className="text-xs">
                  {cuisine}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{deliveryTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;