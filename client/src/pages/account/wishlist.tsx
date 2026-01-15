import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, Heart, ShoppingCart, Trash2, Share2, Eye
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

function WishlistContent() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Neon Streetwear Hoodie",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
      category: "Hoodies",
      inStock: true,
      addedDate: "Nov 25, 2024"
    },
    {
      id: 2,
      name: "Urban Collection T-Shirt",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      category: "T-Shirts",
      inStock: true,
      addedDate: "Nov 20, 2024"
    },
    {
      id: 3,
      name: "Premium Designer Cap",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop",
      category: "Accessories",
      inStock: false,
      addedDate: "Nov 15, 2024"
    },
    {
      id: 4,
      name: "Limited Edition Jacket",
      price: 199.99,
      originalPrice: 249.99,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
      category: "Jackets",
      inStock: true,
      addedDate: "Nov 10, 2024"
    },
  ]);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const addToCart = (item: typeof wishlistItems[0]) => {
    addItem({
      id: item.id,
      variantId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const moveAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    inStockItems.forEach(item => {
      addItem({
        id: item.id,
        variantId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
    });
    toast({
      title: "Items added to cart",
      description: `${inStockItems.length} items have been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="mb-8">
              <Link href="/account">
                <Button variant="ghost" size="sm" className="gap-2 mb-4">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                  <p className="text-gray-500 mt-1">{wishlistItems.length} items saved for later</p>
                </div>
                {wishlistItems.length > 0 && (
                  <Button 
                    className="bg-primary text-white gap-2"
                    onClick={moveAllToCart}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add All to Cart
                  </Button>
                )}
              </div>
            </div>

            {wishlistItems.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-500 mb-4">Start adding items you love to save them for later</p>
                  <Link href="/shop">
                    <Button className="bg-primary text-white">Browse Products</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {wishlistItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-0 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative aspect-[4/5] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium">
                                Out of Stock
                              </span>
                            </div>
                          )}

                          {item.originalPrice && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                              Sale
                            </div>
                          )}

                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                              <Share2 className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-2">
                              {item.inStock && (
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-white text-gray-900 hover:bg-gray-100"
                                  onClick={() => addToCart(item)}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  Add to Cart
                                </Button>
                              )}
                              <Link href="/shop">
                                <Button size="sm" variant="outline" className="bg-white/90">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <p className="text-xs text-primary font-medium mb-1">{item.category}</p>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">Added {item.addedDate}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Wishlist() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}
