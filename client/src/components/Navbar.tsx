import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Bell, ChevronDown, User, LogIn, UserPlus, LayoutDashboard, Settings, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { useCart, type CartItem } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import fortressLogo from "@assets/favicon_1764684253236.png";

const productCategories = [
  { name: "T-Shirts", href: "/shop?category=t-shirts" },
  { name: "Hoodies", href: "/shop?category=hoodies" },
  { name: "Sweatshirts", href: "/shop?category=sweatshirts" },
  { name: "Water Bottles", href: "/shop?category=waterbottles" },
  // { name: "Posters", href: "/shop?category=posters" },
  // { name: "Phone Cases", href: "/shop?category=phone-cases" },
  { name: "Bags", href: "/shop?category=bags" },
  { name: "All Products", href: "/shop" },
];

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { items } = useCart();
  const { user, logout, loading } = useAuth();
  const cartCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/about", label: "About us" },
    { href: "/shop", label: "Products", hasDropdown: true },
    { href: "/shop?category=merch", label: "Merch" },
    { href: "/shop?new=true", label: "New" },
    { href: "/shop?sale=true", label: "Sales" },
  ];

  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setLocation("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src={fortressLogo} 
              alt="Fortress Designs" 
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight">Fortress Designs</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              link.hasDropdown ? (
                <div key={index} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                    className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                      isActive(link.href) ? "text-primary" : "text-gray-700 hover:text-primary"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${productsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {productsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                      {productCategories.map((category, catIndex) => (
                        <Link
                          key={catIndex}
                          href={category.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                          onClick={() => setProductsDropdownOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={index}
                  href={link.href}
                  className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                    isActive(link.href) ? "text-primary" : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-gray-700 hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-700">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-white">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {!loading && (
              user ? (
                <div className="relative hidden md:block" ref={userDropdownRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  
                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        My Account
                      </Link>
                      <Link
                        href="/account/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/account/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-gray-700 gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-primary text-white gap-2">
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                link.hasDropdown ? (
                  <div key={index} className="space-y-1">
                    <button
                      onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                      className="flex items-center justify-between w-full text-sm font-medium py-2 text-gray-700"
                    >
                      {link.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${productsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {productsDropdownOpen && (
                      <div className="pl-4 space-y-1 border-l-2 border-primary/20">
                        {productCategories.map((category, catIndex) => (
                          <Link
                            key={catIndex}
                            href={category.href}
                            className="block py-2 text-sm text-gray-600 hover:text-primary"
                            onClick={() => { setProductsDropdownOpen(false); setMobileMenuOpen(false); }}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={index}
                    href={link.href}
                    className={`text-sm font-medium py-2 ${
                      isActive(link.href) ? "text-primary" : "text-gray-700"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <hr className="border-gray-200 my-2" />
              {!loading && (
                user ? (
                  <>
                    <div className="py-2">
                      <p className="text-sm font-medium text-gray-900">{user.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        My Account
                      </Button>
                    </Link>
                    <Link href="/account/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Button>
                    </Link>
                    <Link href="/account/wishlist" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2 text-red-600 hover:bg-red-50" 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary text-white gap-2">
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
