import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Heart, Award, CheckCircle, ArrowRight, Sparkles, Zap, Shield, ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import coverArt from "@assets/neon-light-clothing-room-background_1764621287706_1764684267795.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

// Printful Sync Product structure
interface PrintfulProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

interface ProductVariant {
  id: number;
  retail_price: string;
  currency: string;
}

interface ProductDetails {
  code: number;
  result: {
    sync_product: PrintfulProduct;
    sync_variants: ProductVariant[];
  };
}

interface CatalogResponse {
  code: number;
  result: PrintfulProduct[];
  extra: any[];
  paging: {
    total: number;
    limit: number;
    offset: number;
  };
}

// Category mapping - same as shop page
function categorizeProduct(productName: string): string[] {
  const name = productName.toLowerCase();
  const categories: string[] = [];

  // Check sweatshirt FIRST before t-shirt (sweatshirt contains 'tshirt' substring!)
  if (name.includes('sweatshirt')) {
    categories.push('sweatshirts');
    return categories; // Return early to avoid double categorization
  }
  if (name.includes('hoodie')) {
    categories.push('hoodies');
    return categories;
  }
  if (name.includes('t-shirt') || name.includes('tshirt')) {
    categories.push('t-shirts');
    return categories;
  }
  if (name.includes('water') || name.includes('bottle') || name.includes('cooler')) {
    categories.push('waterbottles');
    return categories;
  }
  if (name.includes('backpack') || name.includes('bag')) {
    categories.push('bags');
    return categories;
  }

  return categories;
}

export default function Home() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("everything");
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  const features = [
    {
      icon: Shield,
      title: "Quality Product",
      description: "Premium materials and craftsmanship in every piece.",
    },
    {
      icon: Zap,
      title: "Best Production",
      description: "State-of-the-art printing technology for vibrant designs.",
    },
    {
      icon: Sparkles,
      title: "100% Authentic",
      description: "Original designs you won't find anywhere else.",
    },
  ];

  const categories = [
    { name: "Everything", value: "everything" },
    { name: "T-Shirts", value: "t-shirts" },
    { name: "Hoodies", value: "hoodies" },
    { name: "Sweatshirts", value: "sweatshirts" },
    { name: "Water Bottles", value: "waterbottles" },
    { name: "Bags", value: "bags" },
  ];

  // Fetch products from API
  const { data, isLoading, error } = useQuery<CatalogResponse>({
    queryKey: ["catalog"],
    queryFn: async () => {
      const response = await fetch("/api/catalog");
      if (!response.ok) {
        throw new Error("Failed to fetch catalog");
      }
      return response.json();
    },
  });

  // Filter products by category - show exactly 4 products
  const filteredProducts = useMemo(() => {
    if (!data?.result || data.result.length === 0) {
      return [];
    }
    
    const allProducts = data.result;
    
    // If "everything" is selected, return first 4 products
    if (activeCategory === "everything") {
      return allProducts.slice(0, 4);
    }
    
    // Filter products that match the active category
    const matchingProducts = allProducts.filter(product => {
      const productCategories = categorizeProduct(product.name);
      // Check if this product belongs to the active category
      return productCategories.length > 0 && productCategories[0] === activeCategory;
    });
    
    // Return up to 4 matching products
    return matchingProducts.slice(0, 4);
  }, [data, activeCategory]);

  // Get product price
  const useProductPrice = (productId: number) => {
    return useQuery<number>({
      queryKey: ["product-price", productId],
      queryFn: async () => {
        try {
          const response = await fetch(`/api/store/products/${productId}`);
          if (!response.ok) {
            return 29.99;
          }
          const data: ProductDetails = await response.json();
          
          if (data.result?.sync_variants && data.result.sync_variants.length > 0) {
            const prices = data.result.sync_variants
              .map(v => parseFloat(v.retail_price))
              .filter(p => !isNaN(p));
            
            if (prices.length > 0) {
              return Math.min(...prices);
            }
          }
          return 29.99;
        } catch (error) {
          return 29.99;
        }
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    const product = data?.result.find(p => p.id === productId);
    if (product) {
      toast({
        title: likedProducts.includes(productId) ? "Removed from wishlist" : "Added to wishlist",
        description: product.name,
      });
    }
  };

  const handleAddToCart = (product: PrintfulProduct, price: number) => {
    addItem({
      id: product.id,
      variantId: product.id,
      name: product.name,
      price: price,
      image: product.thumbnail_url,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const getCategoryUrl = (categoryName: string) => {
    if (categoryName === "everything") return "/shop";
    return `/shop?category=${categoryName}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Bold Designs<br />
                For the<br />
                <span className="text-primary">Fearless</span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-gray-600 text-lg max-w-md"
              >
                Premium streetwear that makes a statement. Express your unique style with our curated collection of bold, vibrant designs.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-lg font-medium">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="px-8 py-6 rounded-full text-lg font-medium border-primary text-primary hover:bg-primary hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">5,000+ Happy Customers</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">4.9/5</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={coverArt}
                  alt="Fortress Designs Collection"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute bottom-6 left-6 right-6"
                >
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">New Collection</p>
                        <p className="font-bold text-gray-900">Neon Streetwear</p>
                      </div>
                      <Link href="/shop">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full">
                          Explore
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Premium Quality</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Exclusive Products
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Discover our curated collection of premium streetwear designed for those who dare to stand out.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-lg rounded-2xl">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Unable to load products</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          )}

          {!isLoading && !error && (
            <motion.div
              key={activeCategory}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  likedProducts={likedProducts}
                  toggleLike={toggleLike}
                  handleAddToCart={handleAddToCart}
                  useProductPrice={useProductPrice}
                />
              ))}
            </motion.div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products in this category yet</p>
              <Button onClick={() => setActiveCategory("everything")}>View All Products</Button>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href={getCategoryUrl(activeCategory)}>
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-lg font-medium">
                View All {activeCategory === "everything" ? "Products" : categories.find(c => c.value === activeCategory)?.name || "Products"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop"
                  alt="Fashion"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden mt-8"
              >
                <img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop"
                  alt="Fashion"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                We Provide Best Customer Experience
              </h2>
              <p className="text-gray-500 leading-relaxed">
                At Fortress Designs, we ensure that our customers have the best shopping experience. Our team is dedicated to providing top-notch service and quality products.
              </p>
              
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-gray-700 font-medium">Original Products</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-gray-700 font-medium">Satisfaction Guarantee</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-gray-700 font-medium">New Arrivals Everyday</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Fortress Community
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Subscribe to our newsletter and get 10% off your first order plus exclusive access to our new arrivals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-medium">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Separate ProductCard component
function ProductCard({ 
  product, 
  likedProducts,
  toggleLike,
  handleAddToCart,
  useProductPrice
}: { 
  product: PrintfulProduct;
  likedProducts: number[];
  toggleLike: (id: number) => void;
  handleAddToCart: (product: PrintfulProduct, price: number) => void;
  useProductPrice: (productId: number) => { data: number | undefined; isLoading: boolean };
}) {
  const { data: price, isLoading: priceLoading } = useProductPrice(product.id);
  const displayPrice = price || 29.99;
  const categories = categorizeProduct(product.name);
  const categoryMap: {[key: string]: string} = {
    't-shirts': 'T-Shirts',
    'hoodies': 'Hoodies',
    'sweatshirts': 'Sweatshirts',
    'waterbottles': 'Water Bottles',
    'bags': 'Bags'
  };
  const displayCategory = categories[0] ? categoryMap[categories[0]] || 'Fortress Designs' : 'Fortress Designs';

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl bg-white group">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.thumbnail_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg text-sm font-medium text-gray-900 shadow-sm">
            {displayCategory}
          </div>
          <button
            onClick={() => toggleLike(product.id)}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              likedProducts.includes(product.id)
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:bg-primary hover:text-white"
            }`}
          >
            <Heart className="h-5 w-5" fill={likedProducts.includes(product.id) ? "currentColor" : "none"} />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 bg-white text-gray-900 hover:bg-gray-100"
                onClick={() => handleAddToCart(product, displayPrice)}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
              <Link href="/shop">
                <Button size="sm" variant="outline" className="bg-white/90 border-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-lg font-bold text-primary">
            {priceLoading ? (
              <Skeleton className="h-6 w-16 inline-block" />
            ) : (
              `$${displayPrice.toFixed(2)}`
            )}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
