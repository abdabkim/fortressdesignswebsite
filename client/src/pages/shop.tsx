import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useLocation, useSearch } from "wouter";
import { useMemo } from "react";

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
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  retail_price: string;
  currency: string;
  is_ignored: boolean;
  sku: string | null;
  product: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  };
  files: Array<{
    id: number;
    type: string;
    hash: string;
    url: string;
    filename: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    dpi: number;
    status: string;
    created: number;
    thumbnail_url: string;
    preview_url: string;
    visible: boolean;
  }>;
}

interface ProductDetails {
  code: number;
  result: {
    sync_product: {
      id: number;
      external_id: string;
      name: string;
      variants: number;
      synced: number;
      thumbnail_url: string;
      is_ignored: boolean;
    };
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

// Category mapping based on product names
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

export default function Shop() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  const category = urlParams.get('category');
  const isNew = urlParams.get('new') === 'true';
  const isSale = urlParams.get('sale') === 'true';

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

  // Filter products by category
  const displayProducts = useMemo(() => {
    if (!data?.result) return [];
    
    // For now, "New" and "Sale" show all products (limited to 4)
    // You can update these when you add the product metadata
    if (isNew) {
      // TODO: Filter by products marked as "new" when you add that field
      return data.result.slice(0, 4);
    }
    
    if (isSale) {
      // TODO: Filter by products marked as "on sale" when you add that field
      return data.result.slice(0, 4);
    }
    
    if (!category || category === 'all') {
      return data.result; // Show ALL products
    }
    
    // Special handling for "merch" category
    if (category === 'merch') {
      // Return empty array for blank page until API is linked
      return [];
    }

    return data.result.filter(product => {
      const categories = categorizeProduct(product.name);
      return categories.includes(category);
    }).slice(0, 4); // Limit to 4 products per category
  }, [data?.result, category, isNew, isSale]);

  // Get product price (fetch from variants)
  const useProductPrice = (productId: number) => {
    return useQuery<number>({
      queryKey: ["product-price", productId],
      queryFn: async () => {
        try {
          const response = await fetch(`/api/store/products/${productId}`);
          if (!response.ok) {
            return 29.99; // Default price
          }
          const data: ProductDetails = await response.json();
          
          // Get the lowest price from variants
          if (data.result?.sync_variants && data.result.sync_variants.length > 0) {
            const prices = data.result.sync_variants
              .map(v => parseFloat(v.retail_price))
              .filter(p => !isNaN(p));
            
            if (prices.length > 0) {
              return Math.min(...prices);
            }
          }
          return 29.99; // Default if no variants
        } catch (error) {
          console.error('Error fetching price:', error);
          return 29.99;
        }
      },
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
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

  const getCategoryTitle = () => {
    if (isNew) return "New Arrivals";
    if (isSale) return "Sale Items";
    if (!category) return "All Products";
    switch (category) {
      case 't-shirts': return "T-Shirts";
      case 'hoodies': return "Hoodies";
      case 'sweatshirts': return "Sweatshirts";
      case 'waterbottles': return "Water Bottles";
      case 'bags': return "Bags";
      case 'merch': return "Merch";
      default: return "All Products";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="bg-white py-16 text-center border-b" data-testid="shop-header">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900" data-testid="text-shop-title">
            {getCategoryTitle()}
          </h1>
          <p className="text-xl text-gray-600">
            {isNew 
              ? "Check out our latest arrivals"
              : isSale
              ? "Amazing deals on selected items"
              : category 
              ? `Browse our collection of ${getCategoryTitle().toLowerCase()}`
              : "Premium streetwear for the bold and fearless"
            }
          </p>
          {(category || isNew || isSale) && (
            <Link href="/shop">
              <Button variant="outline" className="mt-4">
                View All Products
              </Button>
            </Link>
          )}
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-20" data-testid="error-message">
              <p className="text-destructive text-lg mb-4">
                Unable to load products. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="products-grid">
              {displayProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  useProductPrice={useProductPrice}
                />
              ))}
            </div>
          )}

          {!isLoading && !error && displayProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">
                No products available in this category at the moment.
              </p>
              <Link href="/shop">
                <Button>
                  View All Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Separate ProductCard component to handle individual price fetching
function ProductCard({ 
  product, 
  onAddToCart,
  useProductPrice 
}: { 
  product: PrintfulProduct;
  onAddToCart: (product: PrintfulProduct, price: number) => void;
  useProductPrice: (productId: number) => { data: number | undefined; isLoading: boolean };
}) {
  const { data: price, isLoading: priceLoading } = useProductPrice(product.id);
  const displayPrice = price || 29.99;

  return (
    <Card
      className="group overflow-hidden border-border hover:shadow-lg transition-shadow"
      data-testid={`product-card-${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.thumbnail_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="icon"
              className="bg-white text-foreground hover:bg-white/90"
              onClick={() => onAddToCart(product, displayPrice)}
              data-testid={`button-add-cart-${product.id}`}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Link href={`/product/${product.id}`}>
              <Button
                size="icon"
                variant="outline"
                className="bg-white/80 hover:bg-white"
                data-testid={`button-view-${product.id}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-2" data-testid={`text-product-title-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          Fortress Designs • {product.variants} variant{product.variants !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            {priceLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              `$${displayPrice.toFixed(2)}`
            )}
          </span>
          <Button
            size="sm"
            onClick={() => onAddToCart(product, displayPrice)}
            className="gradient-bg-accent text-white border-0"
            data-testid={`button-add-${product.id}`}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
