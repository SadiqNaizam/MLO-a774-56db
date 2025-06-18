import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tags } from 'lucide-react';

// Cart Item Interface
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const CartPage = () => {
  console.log('CartPage loaded');
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 'item1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { id: 'item2', name: 'Pepsi Can (330ml)', price: 1.50, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1553480139-a919847539b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { id: 'item3', name: 'Gourmet Side Salad', price: 4.75, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  ]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  const handleSetQuantity = (itemId: string, newQuantity: number) => {
    let quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1
    if (isNaN(quantity)) quantity = 1; // Fallback if not a number

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: quantity }
          : item
      )
    );
  };
  
  const handleQuantityChangeByIncrement = (itemId: string, increment: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + increment) }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example fixed delivery fee

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.10); // 10% discount
      setAppliedPromoCode(promoCode.toUpperCase());
      // Ideally, use a toast notification here for success
      console.log("Promo code 'SAVE10' applied.");
    } else if (promoCode.toUpperCase() === 'FREEFRIES') {
        setDiscount(2.50); // Example fixed discount
        setAppliedPromoCode(promoCode.toUpperCase());
        console.log("Promo code 'FREEFRIES' applied.");
    } else {
      setDiscount(0);
      setAppliedPromoCode('');
      // Ideally, use a toast notification here for invalid code
      console.log(`Invalid promo code: ${promoCode}`);
    }
  };

  // Recalculate discount if subtotal changes (e.g. SAVE10 is percentage based)
  useEffect(() => {
    if (appliedPromoCode === 'SAVE10') {
      setDiscount(subtotal * 0.10);
    }
    // Fixed discounts like FREEFRIES would remain the same regardless of subtotal change,
    // unless they have conditions like minimum order value not handled here.
  }, [subtotal, appliedPromoCode]);

  const total = subtotal + deliveryFee - discount;
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* AppHeader Section */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center">
            <ShoppingBag className="h-7 w-7 mr-2" />
            FoodApp
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/restaurant-listing">
              <Button variant="ghost">Restaurants</Button>
            </Link>
            <Link to="/cart" className="relative p-2">
              <ShoppingBag className="h-6 w-6 text-gray-600 hover:text-primary" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4 hidden sm:inline-flex" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Your Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12 shadow-lg">
            <CardContent className="flex flex-col items-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <p className="text-xl text-gray-700 mb-2 font-medium">Your cart is currently empty.</p>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything yet. Start browsing our restaurants to find something delicious!</p>
              <Button size="lg" onClick={() => navigate('/restaurant-listing')}>
                Explore Restaurants
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Items in your cart ({cartItemCount})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px] sm:w-[100px] hidden md:table-cell pr-0">Image</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-center w-[130px] sm:w-[150px]">Quantity</TableHead>
                          <TableHead className="text-right hidden sm:table-cell">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-[50px] pl-0 text-right"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="hidden md:table-cell p-2">
                              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                            </TableCell>
                            <TableCell className="font-medium py-3">
                              {item.name}
                              <div className="sm:hidden text-xs text-muted-foreground">${item.price.toFixed(2)} each</div>
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChangeByIncrement(item.id, -1)} disabled={item.quantity <= 1}>
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleSetQuantity(item.id, parseInt(e.target.value, 10))}
                                  className="w-10 sm:w-12 h-8 text-center px-1"
                                  min="1"
                                />
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChangeByIncrement(item.id, 1)}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell py-3">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-semibold py-3">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell className="text-right p-1 sm:p-2 py-3">
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} aria-label={`Remove ${item.name}`}>
                                <Trash2 className="h-5 w-5 text-destructive hover:text-red-700" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              <Button variant="link" className="mt-6 text-primary" onClick={() => navigate('/restaurant-listing')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-4">
              <Card className="shadow-lg sticky top-24"> {/* Sticky for long item lists */}
                <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  <div className="space-y-2">
                     <label htmlFor="promoCode" className="text-sm font-medium flex items-center">
                       <Tags className="h-4 w-4 mr-2 text-gray-500"/>
                       Promotional Code
                     </label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="promoCode" 
                        placeholder="Enter code (e.g. SAVE10)" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-grow"
                        aria-label="Promotional Code"
                      />
                      <Button onClick={handleApplyPromoCode} variant="secondary" className="whitespace-nowrap px-3">Apply</Button>
                    </div>
                  </div>

                  {appliedPromoCode && discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount ({appliedPromoCode})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 pt-6">
                  <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                    Proceed to Checkout
                  </Button>
                  <p className="text-xs text-gray-500 text-center">Taxes and additional fees may apply at checkout.</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* AppFooter Section */}
      <footer className="bg-gray-100 border-t mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} FoodApp, Inc. All rights reserved.
          <nav className="mt-2 space-x-3">
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;