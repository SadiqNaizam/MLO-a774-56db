import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, PlusCircle } from 'lucide-react';

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  // Placeholder for a more complex availability or stock status if needed in the future
  // availability?: 'available' | 'unavailable'; 
  onAddToCart?: (item: { id: string | number; name: string; price: number }) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  // availability = 'available',
  onAddToCart,
}) => {
  const { toast } = useToast();
  console.log('MenuItemCard loaded for:', name);

  const handleAddToCartClick = () => {
    // if (availability === 'unavailable') {
    //   toast({
    //     title: "Item Unavailable",
    //     description: `${name} is currently not available.`,
    //     variant: "destructive",
    //   });
    //   return;
    // }

    if (onAddToCart) {
      onAddToCart({ id, name, price });
    } else {
      // Default behavior if no onAddToCart prop is provided
      toast({
        title: "Added to cart!",
        description: `${name} has been added to your cart.`,
      });
      console.log(`Added item ${id} (${name}) to cart with price $${price.toFixed(2)}`);
    }
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col group">
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || 'https://via.placeholder.com/400x225?text=Food+Image'}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </AspectRatio>
        {/* Future placeholder for badges like 'New', 'Spicy', etc. */}
        {/* {availability === 'unavailable' && 
          <Badge variant="destructive" className="absolute top-2 right-2 z-10">Unavailable</Badge>
        } */}
      </CardHeader>

      <CardContent className="p-4 space-y-2 flex-grow">
        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        <p className="text-lg font-bold text-gray-800">${price.toFixed(2)}</p>
      </CardContent>

      <CardFooter className="p-4 border-t">
        <Button
          className="w-full"
          onClick={handleAddToCartClick}
          // disabled={availability === 'unavailable'}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
          {/* {availability === 'unavailable' ? "Unavailable" : "Add to Cart"} */}
        </Button>
        {/* 
          Alternative for quantity controls (more complex):
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => console.log('Decrease quantity')}>-</Button>
            <Input type="number" defaultValue="1" className="w-12 text-center" />
            <Button variant="outline" size="icon" onClick={() => console.log('Increase quantity')}>+</Button>
          </div>
        */}
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;